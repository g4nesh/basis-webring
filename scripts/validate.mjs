import { readMembers } from './members.mjs';
const members = await readMembers();
console.log(`Validated ${members.length} members.`);
