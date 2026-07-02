import bcrypt from "bcryptjs";

export const hash = async (plain) => await bcrypt.hash(plain, 10);
export const compare = async (plain, hashStr) => await bcrypt.compare(plain, hashStr);
