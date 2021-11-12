---
id: 202107231940040
aliases: 📕 Sources
display: Sources
tags: area
obsidianUIMode: preview
---
area:: [[_PKM|🗃 PKM]]
```dataviewjs
function getYear(x) {
	return x ? dv.date(x).year.toString() : 'Unfinished'
}

function getCount(group) {
	return group.key + ' (' + group.rows.length + ')'
}

let groups = dv.pages('"80_PKM/82_Sources"').where(p => p.title != dv.current().title).groupBy(p => getYear(p.completed))

for (let group of groups.sort(g => g.key, 'desc')) {
	dv.header(1, group.key);
	dv.table(["Title", "Author", "Read", "🔗"],
		group.rows
			.sort(k => k.completed, 'desc')
			.map(k => ['[' + k.title + '](' + k.file.path + ')', k.authors, k.completed, k.zotero]))
}
```
