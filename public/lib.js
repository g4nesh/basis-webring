export function validateMembers(members) {
  const ids = new Set();
  const urls = new Set();
  for (const member of members) {
    const { id, name, year, url } = member;
    if (Object.keys(member).some(key => !['id', 'name', 'year', 'url'].includes(key))) throw new Error(`${id}: unexpected field. Use only name, year and url.`);
    if (typeof id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || id.length > 80) throw new Error('Use a lowercase hyphenated filename.');
    if (ids.has(id)) throw new Error(`Duplicate member: ${id}`);
    ids.add(id);
    if (typeof name !== 'string' || name.trim() !== name || name.length < 2 || name.length > 80 || /[<>\x00-\x1f]/.test(name)) throw new Error(`${id}: enter a name between 2 and 80 characters.`);
    if (!Number.isInteger(year) || year < 1000 || year > 9999) throw new Error(`${id}: enter a four-digit graduation year.`);
    let parsed;
    try { parsed = new URL(url); } catch { throw new Error(`${id}: enter a valid website URL.`); }
    if (typeof url !== 'string' || parsed.protocol !== 'https:' || !parsed.hostname.includes('.') || parsed.username || parsed.password || url.length > 500) throw new Error(`${id}: use a public HTTPS website without embedded credentials.`);
    const canonical = `${parsed.hostname.replace(/^www\./, '')}${parsed.pathname.replace(/\/$/, '')}${parsed.search}`;
    if (urls.has(canonical)) throw new Error(`${id}: this website is already in the ring.`);
    urls.add(canonical);
  }
  return members;
}

export function filterMembers(members, query, year = '') {
  const search = query.trim().toLocaleLowerCase();
  return members.filter(member => (!year || String(member.year) === year) && `${member.name} ${member.year} ${member.url}`.toLocaleLowerCase().includes(search));
}

export function ringTarget(members, id, direction, random = Math.random) {
  if (!members.length) return null;
  const index = members.findIndex(member => member.id === id);
  if (direction === 'random') {
    const choices = members.filter(member => member.id !== id);
    return choices.length ? choices[Math.floor(random() * choices.length)] : members[0];
  }
  if (index === -1 || !['next', 'prev'].includes(direction)) return null;
  return members[(index + (direction === 'next' ? 1 : -1) + members.length) % members.length];
}

export function ringEdges(members) {
  if (members.length < 2) return [];
  if (members.length === 2) return [[members[0].id, members[1].id]];
  return members.map((member, index) => [member.id, members[(index + 1) % members.length].id]);
}
