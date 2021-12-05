<%*
const dv = app.plugins.plugins.dataview.api;

const getAlias = (p) => {
	if (p.file.aliases) {
		return p.file.aliases[0]
	} else { return p.file.name }
}
const rxDates = /[0-9]{4}-[0-9]{2}-[0-9]{2}/g;
const dates = tp.file.title.match(rxDates);
const start = dates ? dates[0] : null;
const due = dates && dates.length > 1 ? dates[1] : null;
const thisType = tp.file.title.match("!project") ? "project" : (tp.file.title.match("!area") ? "area" : null);
const cleanTitle = tp.file.title.replaceAll(rxDates, "").replace("!project", "").replace("!area", "").trim();
const dvFiles = await dv.pages("#area or #project").filter(p => p.file.folder != "00_Meta/01_Templates");
const pickedFile = await tp.system.suggester((item) => getAlias(item), dvFiles, false, "Select parent...");
const path = pickedFile.file.folder + "/" + cleanTitle;
const type = pickedFile.tags.includes("project") ? "project" : (pickedFile.tags.includes("area") ? "area" : null);
const alias = path.replaceAll(/[0-9]{2}_/g,"").replaceAll("/",".");

if ((await app.vault.getAllLoadedFiles()).map(f => f.path).includes(path)) {
	new Notice("The folder you're trying to create already exists.");
} else if (!type) {
	new Notice("The file you picked is neither a project nor an area. Make sure it was tagged with 'project' or 'area' and check the template for errors.")
} else {
	await app.vault.createFolder(path);
}
	await tp.file.move(path + "/_" + cleanTitle);
	tR += "---\n";
	tR += "id: " + tp.date.now("YYYYMMDDHHmmssSSS") + "\n";
	tR += "aliases: " + (thisType ? '[' + (thisType == 'project' ? '"⭕️ ' : (thisType == 'area' ? '"🗃 ' : '')) + alias + '"]' : "") + "\n";
	tR += "display: " + cleanTitle + "\n";
	tR += "tags: " + thisType + "\n";
	tR += "---\n";

	if (type == "project") {
		tR += "project:: " + ( pickedFile ? "[[" + pickedFile.file.name + "|" + getAlias(pickedFile) + "]]" : "" ) + "\n";
		tR += "area:: " + ( pickedFile.area.path ? "[[" + pickedFile.area.path + "|" + pickedFile.area.display + "]]" : "") + "\n\n";
	} else if (type == "area") {
		tR += "area:: " + ( pickedFile ? "[[" + pickedFile.file.name + "|" + getAlias(pickedFile) + "]]" : "" ) + "\n\n";
	} 

  tR += thisType == "area" ? "# " + cleanTitle : "```dataviewjs\ncustomJS.DvTasks.checkboxInNote({app, dv, luxon, moment, markComplete: customJS.MarkTask.complete, that:this})\n```";
	tR += "\n\n";

	if (thisType == "project") {
		tR += "start:: " + (start ? "[[" + start + "]]" : "") + "\n";
		tR += "due:: " + (due ? "[[" + due + "]]" : "") + "\n";
		tR += "completed:: \n\n";
		tR += "---\n\n";
	}
	tR += '```dataviewjs\n'
	tR += 'const {DvTasks} = customJS\n'
	tR += 'const {MarkTask} = customJS\n'
	tR += 'DvTasks.areaOrProject({app, dv, moment, luxon, that:this, markComplete:MarkTask.complete})\n'
	tR += '```\n'
%>