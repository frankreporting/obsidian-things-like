<%*
if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(tp.file.title)) {
	let dailyNote = await tp.file.include("[[Daily Note]]");
	tR += dailyNote;
} 
else if (tp.file.title.search(/^[0-9]{4}-[0-9]{2}-[0-9]{2} .*$/) !=-1) {
	let log = await tp.file.include("[[Log]]");
	tR += log;
} 
else if (/^@/.test(tp.file.title)) {
	let person = await tp.file.include("[[Person]]");
	tR += person;
} 
else if (/!task/.test(tp.file.title)) {
	let task = await tp.file.include("[[Task]]");
	tR += task;
} 
else if (/!project/.test(tp.file.title)) {
	let project = await tp.file.include("[[Area or Project]]");
	tR += project;
}
else if (/!area/.test(tp.file.title)) {
	let area = await tp.file.include("[[Area or Project]]");
	tR += area;
}
else {
	tR += "---\n" + "id: " + tp.date.now("YYYYMMDDHHmmssS") + "\n---";
}
%>