<%*
if (tp.file.folder(true) != "00_Meta/06_Logbook") { 
	await tp.file.move("/00_Meta/06_Logbook/" + tp.file.title) 
}
const displayDate = (datestr) => tp.date.now(datestr, 0, tp.file.title, "YYYY-MM-DD")
tR+="---\n"
tR+="alias: " + displayDate("M/D/YY dddd") + "\n"
tR+="---\n"
tR+="# " + displayDate("dddd, MMMM D, YYYY")
tR+="\n"
tp.file.cursor(0)
%>

# Log
```dataviewjs
const {DvTasks} = customJS
const {MarkTask} = customJS

DvTasks.dailyLog({app, dv, moment, luxon, that:this, markComplete:MarkTask.complete})
```
