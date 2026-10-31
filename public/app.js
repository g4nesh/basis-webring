import { filterMembers, ringEdges, ringTarget, validateMembers } from './lib.js';
const $ = selector => document.querySelector(selector);
const repo = 'https://github.com/g4nesh/basis-webring';
let members = [];
const NS = 'http://www.w3.org/2000/svg';
function svgElement(tag, attrs, text) {
  const element = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, value);
  if (text) element.textContent = text;
  return element;
}
function drawGraph(visible) {
  const graph = $('#graph');
  graph.querySelectorAll('g').forEach(node => node.remove());
  const group = svgElement('g', {});
  const points = new Map(members.map((member, index) => {
    const angle = -Math.PI / 2 + index / members.length * Math.PI * 2;
    return [member.id, { x: 215 + Math.cos(angle) * 100, y: 140 + Math.sin(angle) * 100, angle }];
  }));
  const ids = new Set(visible.map(member => member.id));
  for (const [source, target] of ringEdges(members)) {
    const a = points.get(source), b = points.get(target);
    group.append(svgElement('path', { d: `M${a.x},${a.y} L${b.x},${b.y}`, class: 'edge', opacity: ids.has(source) && ids.has(target) ? 1 : .15 }));
  }
  members.forEach(member => {
    const { x, y } = points.get(member.id);
    const active = ids.has(member.id);
    const link = svgElement('a', { href: member.url, 'aria-label': `${member.name}, class of ${member.year}, visit website`, opacity: active ? 1 : .15, tabindex: active ? 0 : -1 });
    link.append(svgElement('title', {}, `${member.name} · ${member.year}`));
    link.append(svgElement('circle', { cx: x, cy: y, r: 6, class: 'node-dot' }));
    const top = y < 60;
    const anchor = Math.abs(x - 215) < 5 ? 'middle' : x > 215 ? 'start' : 'end';
    const offset = anchor === 'middle' ? 0 : anchor === 'start' ? 13 : -13;
    // Larger rings use accessible node titles and the directory instead of crowded labels.
    if (members.length <= 8) {
      link.append(svgElement('text', { x: x + offset, y: y + (top ? -19 : -2), 'text-anchor': anchor, class: 'node-label' }, member.name.split(' ')[0]));
    }
    group.append(link);
  });
  graph.append(group);
}
function render() {
  const visible = filterMembers(members, $('#search').value, $('#year').value);
  const ids = new Set(visible.map(member => member.id));
  document.querySelectorAll('#members tr').forEach(row => { row.hidden = !ids.has(row.dataset.member); });
  $('#empty').hidden = visible.length > 0;
  $('#results').textContent = visible.length === members.length ? `${members.length} members` : `${visible.length} of ${members.length} members`;
  drawGraph(visible);
}
function updateWidget() {
  const id = $('#widget-member').value;
  const base = location.origin;
  $('#widget-code').textContent = `<nav aria-label="BASIS web ring">\n  <a href="${base}/?from=${id}&to=prev" aria-label="Previous site">←</a>\n  <a href="${base}">BASIS web ring</a>\n  <a href="${base}/?from=${id}&to=next" aria-label="Next site">→</a>\n</nav>`;
  $('#copy-status').textContent = '';
}
function openForm() {
  $('#join-form').hidden = false;
  $('#member-form').elements.name.focus({ preventScroll: true });
}
$('#join-open').addEventListener('click', openForm);
$('#join-close').addEventListener('click', () => { $('#join-form').hidden = true; $('#join-open').focus(); });
if (location.hash === '#join-form') openForm();
$('#member-form').elements.year.max = String(new Date().getUTCFullYear());
$('#member-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = data.get('name').trim();
  const id = name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `member-${Date.now()}`;
  const member = { name, year: Number(data.get('year')), url: data.get('url').trim() };
  try {
    validateMembers([...members, { ...member, id }]);
    const params = new URLSearchParams({ filename: `members/${id}.json`, value: JSON.stringify(member, null, 2) + '\n', message: `Add ${name} to the ring` });
    location.assign(`${repo}/new/main?${params}`);
  } catch (error) { $('#form-error').textContent = error.message; }
});
$('#search').addEventListener('input', render);
$('#year').addEventListener('change', render);
$('#clear-search').addEventListener('click', () => { $('#search').value = ''; $('#year').value = ''; render(); $('#search').focus(); });
document.addEventListener('keydown', event => {
  if (event.key === '/' && !event.metaKey && !event.ctrlKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) { event.preventDefault(); $('#search').focus(); }
});
$('#random').addEventListener('click', () => { const target = ringTarget(members, '', 'random'); if (target) location.assign(target.url); });
$('#widget-member').addEventListener('change', updateWidget);
$('#copy-widget').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('#widget-code').textContent); $('#copy-status').textContent = 'Copied. Paste it into your website’s HTML.'; }
  catch { $('#copy-status').textContent = 'Select the HTML above and copy it manually.'; }
});
try {
  const response = await fetch('/members.json');
  if (!response.ok) throw new Error('Could not load members');
  members = validateMembers(await response.json());
  const params = new URLSearchParams(location.search);
  if (params.has('to')) {
    const target = ringTarget(members, params.get('from'), params.get('to'));
    if (target) location.replace(target.url);
    else { $('#app-error').hidden = false; $('#app-error').textContent = 'That ring link is no longer valid. Find a member below or take a random turn.'; }
  }
  for (const year of [...new Set(members.map(member => member.year))].sort((a, b) => b - a)) $('#year').add(new Option(String(year), String(year)));
  for (const member of members) $('#widget-member').add(new Option(member.name, member.id));
  $('#random').disabled = members.length === 0;
  $('#widget').hidden = members.length === 0;
  updateWidget();
  render();
} catch {
  $('#app-error').hidden = false;
  $('#app-error').textContent = 'Interactive features could not load. The member links and GitHub contribution guide still work. Please refresh to try again.';
  $('#random').disabled = true;
  $('#search').disabled = true;
  $('#year').disabled = true;
  $('#widget').hidden = true;
}
