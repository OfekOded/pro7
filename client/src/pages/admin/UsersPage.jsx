import { useEffect, useMemo, useState } from "react";
import { Topbar } from "../../components/layout";
import { Button, Chip, Table, Avatar, EmptyState, PageLoader } from "../../components/ui";
import { Icon } from "../../components/icons";
import { ROLE_LABEL, ROLES } from "../../lib/roles";
import { useFetch } from "../../hooks/useFetch";
import { adminService } from "../../services/adminService";
import styles from "./UsersPage.module.css";

const ROLE_ORDER = [ROLES.patient, ROLES.doctor, ROLES.receptionist, ROLES.admin];
const ROLE_TONE = {
  patient: styles => styles.tagBrand,
  doctor: styles => styles.tagGreen,
  receptionist: styles => styles.tagAmber,
  admin: styles => styles.tagInk,
};

/**
 * UsersPage (מנהל/ת) — ניהול משתמשים.
 *
 * ✦ מסך ניהול מלא: חיפוש, סינון לפי תפקיד עם מונים, טבלה עם תגיות תפקיד/סטטוס,
 *   השבתה/הפעלה מול ה-API (PATCH /users/:id) + טוסט.
 * הנתונים נשלפים דרך adminService (GET /users — admin בלבד).
 */
export function AdminUsersPage() {
  const { data, isLoading } = useFetch(() => adminService.users(), []);
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("all");
  const [q, setQ] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (data) setUsers(data);
  }, [data]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const counts = useMemo(() => {
    const c = { all: users.length };
    for (const r of ROLE_ORDER) c[r] = users.filter((u) => u.role === r).length;
    return c;
  }, [users]);

  const visible = users.filter((u) => {
    const byRole = role === "all" || u.role === role;
    const byQ = !q || u.name.includes(q) || u.email.toLowerCase().includes(q.toLowerCase());
    return byRole && byQ;
  });

  const toggleStatus = async (u) => {
    const nextStatus = u.status === "active" ? "disabled" : "active";
    try {
      await adminService.setUserStatus(u.id, nextStatus);
      setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, status: nextStatus } : x)));
      setToast(`${u.name} ${nextStatus === "disabled" ? "הושבת/ה" : "הופעל/ה"}`);
    } catch (err) {
      setToast(err.message || "העדכון נכשל — נסו שוב");
    }
  };

  const roleTag = (r) => (
    <span className={`${styles.tag} ${ROLE_TONE[r]?.(styles) || ""}`}>{ROLE_LABEL[r]}</span>
  );

  const head = ["משתמש", "תפקיד", "דוא״ל", "טלפון", "סטטוס", ""];
  const rows = visible.map((u) => [
    <span className={styles.userCell} key="u">
      <Avatar initial={u.initial} size={34} tone={u.role === "doctor" ? "green" : "brand"} />
      <span className={styles.userName}>{u.name}</span>
    </span>,
    roleTag(u.role),
    <span className="ltr" key="e">{u.email}</span>,
    <span className="ltr" key="p">{u.phone}</span>,
    <span className={`${styles.status} ${u.status === "active" ? styles.active : styles.disabled}`} key="s">
      {u.status === "active" ? "פעיל" : "מושבת"}
    </span>,
    <div className={styles.rowActions} key="a">
      <Button variant="outline" size="sm">עריכה</Button>
      <Button variant={u.status === "active" ? "danger" : "secondary"} size="sm" onClick={() => toggleStatus(u)}>
        {u.status === "active" ? "השבתה" : "הפעלה"}
      </Button>
    </div>,
  ]);

  return (
    <>
      <Topbar
        title="ניהול משתמשים"
        actions={
          <Button size="sm" iconStart={<Icon name="plus" size={15} stroke={2.6} />}>
            משתמש חדש
          </Button>
        }
      />

      <div className={styles.body}>
        <div className={styles.toolbar}>
          <div className={styles.search}>
            <Icon name="search" size={16} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="חיפוש לפי שם או דוא״ל…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className={styles.filters}>
            <Chip label="הכל" count={counts.all} active={role === "all"} onClick={() => setRole("all")} />
            {ROLE_ORDER.map((r) => (
              <Chip
                key={r}
                label={ROLE_LABEL[r]}
                count={counts[r]}
                active={role === r}
                onClick={() => setRole(r)}
              />
            ))}
          </div>
        </div>

        {isLoading ? (
          <PageLoader label="טוען משתמשים…" />
        ) : visible.length === 0 ? (
          <EmptyState icon="users" title="לא נמצאו משתמשים" description="נסה/י חיפוש אחר או סינון אחר." />
        ) : (
          <div key={`${role}-${q}`} className={styles.reveal}>
            <Table head={head} rows={rows} />
          </div>
        )}
      </div>

      {toast ? (
        <div className={styles.toast} role="status">
          <Icon name="checkCircle" size={18} />
          {toast}
        </div>
      ) : null}
    </>
  );
}

export default AdminUsersPage;
