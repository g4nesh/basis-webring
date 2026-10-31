import test from 'node:test';
import assert from 'node:assert/strict';
import { validateMembers, filterMembers, ringTarget, ringEdges } from '../public/lib.js';
import { readMembers } from '../scripts/members.mjs';
const members = [
  { id: 'alice', name: 'Alice Example', year: 2025, url: 'https://alice.example/' },
  { id: 'bob', name: 'Bob Example', year: 2026, url: 'https://bob.example/' },
  { id: 'charlie', name: 'Charlie Example', year: 2026, url: 'https://charlie.example/' }
];
test('production member records validate', async () => assert.ok((await readMembers()).length >= 3));
test('navigation wraps in both directions', () => {
  assert.equal(ringTarget(members, 'charlie', 'next').id, 'alice');
  assert.equal(ringTarget(members, 'alice', 'prev').id, 'charlie');
  assert.equal(ringTarget(members, 'alice', 'next').id, 'bob');
});
test('invalid IDs and directions cannot redirect to arbitrary URLs', () => {
  assert.equal(ringTarget(members, 'https://evil.example', 'next'), null);
  assert.equal(ringTarget(members, 'alice', 'https://evil.example'), null);
  assert.equal(ringTarget([], 'alice', 'next'), null);
});
test('one-member rings are valid and random skips the current member', () => {
  assert.equal(ringTarget(members.slice(0, 1), 'alice', 'prev').id, 'alice');
  assert.equal(ringTarget(members, 'alice', 'random', () => 0).id, 'bob');
  assert.equal(ringTarget(members, 'alice', 'random', () => .999).id, 'charlie');
});
test('search is case-insensitive and combines with year filtering', () => {
  assert.deepEqual(filterMembers(members, ' ALICE ').map(m => m.id), ['alice']);
  assert.equal(filterMembers(members, 'example', '2026').length, 2);
  assert.equal(filterMembers(members, 'alice', '2026').length, 0);
  assert.equal(filterMembers(members, '2025').length, 1);
});
test('graph is a closed ring with no self-edges or duplicate two-person edges', () => {
  assert.deepEqual(ringEdges(members), [['alice', 'bob'], ['bob', 'charlie'], ['charlie', 'alice']]);
  assert.deepEqual(ringEdges(members.slice(0, 2)), [['alice', 'bob']]);
  assert.deepEqual(ringEdges(members.slice(0, 1)), []);
});
test('validation rejects script URLs, credentials, missing names and invalid years', () => {
  for (const overrides of [{ url: 'javascript:alert(1)' }, { url: 'http://alice.example' }, { url: 'https://user:pass@alice.example' }, { name: '<script>' }, { name: '' }, { year: '2026' }, { year: 1997 }, { year: new Date().getUTCFullYear() + 1 }, { campus: 'Peoria' }]) {
    assert.throws(() => validateMembers([{ ...members[0], ...overrides }]));
  }
});
test('duplicate sites and IDs are rejected', () => {
  assert.throws(() => validateMembers([...members, { ...members[0], id: 'other', url: 'https://www.alice.example' }]));
  assert.throws(() => validateMembers([...members, { ...members[0], url: 'https://different.example' }]));
});
