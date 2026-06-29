const members = [
  { name: 'Alice', role: 'Frontend' },
  { name: 'Bob', role: 'Backend' },
  { name: 'Charlie', role: 'DevOps' },
];

const list = document.getElementById('member-list');

if (list) {
  members.forEach(m => {
    const li = document.createElement('li');
    li.textContent = `${m.name} — ${m.role}`;
    list.appendChild(li);
  });
}
