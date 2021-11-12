<%*
if (tp.file.folder(true) != "00_Meta/06_Logbook") { 
	await tp.file.move("/00_Meta/06_Logbook/" + tp.file.title) 
}
const displayDate = (datestr) => tp.date.now(datestr, 0, tp.file.title, "YYYY-MM-DD")
tR+="---\n"
tR+="alias: " + displayDate("M/D/YY dddd") + "\n"
tR+="---\n"
tR+="# " + displayDate("dddd, MMMM D, YYYY")
%>

<% tp.file.cursor(0) %>

# Log
```dataviewjs
const {DvTasks} = customJS
DvTasks.dailyLog({app, dv, luxon, that:this})
```
