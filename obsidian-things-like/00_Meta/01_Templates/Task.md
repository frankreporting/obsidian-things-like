<%*
const dv = app.plugins.plugins.dataview.api;

const getAlias = (p) => {
	if (p.file.aliases) {
		console.log(p.file.aliases);
		return p.file.aliases[0]
	} else { return p.file.name }
}
const rxDates = /[0-9]{4}-[0-9]{2}-[0-9]{2}/g;
const dates = tp.file.title.match(rxDates);
const start = dates ? dates[0] : null;
const due = dates && dates.length > 1 ? dates[1] : null;
const cleanTitle = tp.file.title.replaceAll(rxDates, "").replace("!task", "").trim();

const dvFiles = await dv.pages("#area or #project").filter(p => p.file.folder != "00_Meta/01_Templates");
console.log(dvFiles);
const pickedFile = await tp.system.suggester((item) => getAlias(item), dvFiles, false, "Select project or area...");
await tp.file.move(pickedFile.file.folder + "/" + cleanTitle);
const type = pickedFile.tags.includes("project") ? "project" : (pickedFile.tags.includes("area") ? "area" : null);

tR += "---\n";
tR += "id: " + tp.date.now("YYYYMMDDHHmmssSSS") + "\n";
tR += "tags: task\n";
tR += "---\n";

if (type == "project") {
	tR += "project:: " + ( pickedFile ? "[[" + pickedFile.file.name + "|" + getAlias(pickedFile) + "]]" : "" ) + "\n";
	tR += "area:: " + ( pickedFile.area.path ? "[[" + pickedFile.area.path + "|" + pickedFile.area.display + "]]" : "") + "\n";
} else if (type == "area") {
	tR += "area:: " + ( pickedFile ? "[[" + pickedFile.file.name + "|" + getAlias(pickedFile) + "]]" : "" ) + "\n";
} else {
	throw "The file you picked is neither a project nor an area. Make sure it was tagged with `project` or `area` and check the template for errors."
}
tR += "```dataviewjs\ncustomJS.DvTasks.checkboxInNote({app, dv, luxon, moment, markComplete: customJS.MarkTask.complete, that:this})\n```";
tR += "\n\n";
tR += "start:: " + (start ? "[[" + start + "]]" : "") + "\n";
tR += "due:: " + (due ? "[[" + due + "]]" : "") + "\n";
tR += "completed:: \n\n";
tR += "---\n\n";
%>