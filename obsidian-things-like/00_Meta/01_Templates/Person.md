<%*
const name = /^@/.test(tp.file.title) ? tp.file.title.replace("@","") : tp.file.title;
tR += '---\nid: ' + tp.date.now("YYYYMMDDHHmmssSSS") + '\nalias: "@' + name + '"\n---\n\n'
await tp.file.move('80_PKM/85_People/' + name)

tR += `# ${name}\n`
tR += '**\n\n'
tR += 'Twitter:: [@](https://twitter.com/)\n'
tR += 'Phone:: [](tel:)\n'
tR += 'Email:: \n'
tR += 'Affiliation:: \n\n'
tR += '## Notes\n\n\n'

tR += '```dataviewjs\n'
tR += 'const {DvTasks} = customJS\n'
tR += 'const {MarkTask} = customJS\n'
tR += `DvTasks.viewPerson({app, dv, moment, luxon, that:this, source: "[[" + dv.current().file.name + "]]"})\n`
tR += '```\n'
%>