class DvTasks {

	// ******************************* //
	// ********** UTILITIES ********** //
	// ******************************* //

	checkboxMaker(args) {
		const {
			that,
			app,
			dv,
			fpath,
			moment,
			markComplete,
			checked
		} = args;
		const page = dv.page(fpath);
		const checkbox = that.container.createEl('input')
		checkbox.type = "checkbox";
		checkbox.classList.add("task-list-item", page.file.tags.includes("#project") ? "dv-project" : "dv-check");
		const checkState = page.completed ? true : (page.lastCompleted ? (page.start ? moment(page.start.path).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD") : true) : false);
		checkbox.checked = checkState;
		checkbox.id = fpath;
		const file = that.app.vault.getAbstractFileByPath(fpath);
		checkbox.addEventListener('click', async(evt) => {
			await markComplete({app, dv, fpath, file, moment, that, checked: checkState});
		});
		return checkbox;
	}

	checkboxInNote(args) {
		const {
			that,
			app,
			dv,
			fpath,
			moment,
			markComplete
		} = args;
		let path = fpath ? fpath : dv.current().file.path;
		const file = that.app.vault.getAbstractFileByPath(path);
		const page = dv.page(path);
		const project = page.file.tags.includes("#project");
		const headerRow = that.container.createEl('h1');
		headerRow.classList.add("task-flexbox");
		const checkbox = headerRow.createEl('input');
		checkbox.type = "checkbox";
		checkbox.id = path;
		checkbox.classList.add("task-list-item",project ? "dv-project" : "dv-check","in-note");
		let label = that.container.createEl('span');
		label.addClass("task-list-item");
		label.addClass("dv-label");
		label.innerHTML = `${page.display ? page.display : page.file.name}`;
		headerRow.appendChild(label);
		const checkState = page.completed ? true : (page.lastCompleted ? (page.start ? moment(page.start.path).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD") : true) : false);
		checkbox.checked = checkState;
		checkbox.addEventListener('click', async(evt) => {
			await markComplete({app, dv, path, file, moment, that, checked: checkState});
		});
	}

	dateTimePill(x, moment, type) {
		let dtInstance = x;
		let dtClass = "datetime-pill";
		if (moment(x).isValid()) {
			if (!x[type] && type != "event") { return "" }
			else if (type == "event") { 
				console.log(x);
				dtInstance = x.when ? moment(x.when.path).format("M/D") : "";
			} else {
				const overdue = (x) => !(x.completed) && (x.due) && (moment(x.due.path).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD"));
				dtClass = dtClass + (overdue(x) ? "-overdue" : "-" + type);
				dtInstance = moment(x[type].path).format("M/D");
			}
			
		}
		
		return `<span class='${dtClass}'>` + dtInstance + `</span> `;
	}
	
	typeCheck(tags) {
		const project = tags.includes("#project");
		// const task = tags.includes("#task");
		const area = tags.includes("#area");
		let icon = project ? "⭕️ " : (area ? "🗄 " : "");
		return icon;
	}

	sorter(day, dv) {
		return !day ? "Some Day" : day.path;
	}

	debug(args) {
		// Pass what you need in here and rewrite this function to output into Obsidian note directly
		// to help with debugging
		const {
			dv,
			moment, 
			date,
			that,
			page, 
			finalDate
		} = args;
		dv.paragraph("moment(p.file.day).format('YYYY-MM-DD') ... " + moment(moment(page.file.day)).format("YYYY-MM-DD"));
		dv.paragraph("p.file.day = " + page.file.day);
		dv.paragraph("finalDate = " + moment(finalDate).format("YYYY-MM-DD"));// = 2021-11-12
		dv.paragraph("p.file.name = " + page.file.name);
		dv.el("hr","");
	}

	// *************************** //
	// ********** VIEWS ********** //
	// *************************** //
	
	// ----- View: Log for Daily Note ----- //
	dailyLog(args) {
		this.events(args);
		this.newTasks(args);
		this.dueTasks(args);
		this.reminders(args);
		this.completed(args);
		this.created(args);
	}

	// ------ View: Area or Project ----- //
	areaOrProject(args) {
		const checkSubAreas = args.dv.pages(`"${args.dv.current().file.folder}"`)
			.where(p => p.file.tags.includes("#area")
				&& !p.file.tags.includes("#project")
				&& p.file.name != args.dv.current().file.name)
			.map(p => args.dv.fileLink(p.file.path,false,"🗃 " + p.display));
		this.subAreas(args);
		this.projectGroup(args);
		this.taskGroup(args);
		this.events(args);
		this.completedGroup(args);
		if (!checkSubAreas.length) {
			this.noteGroup(args);
		}
	}

	// ------ View: Log for Person ----- //
	viewPerson(args) {
		this.events(args);
		this.mentions(args);
	}

	// ------ View: Today.md ----- //
	viewToday(args) {
		this.events({...args, viewToday:true});
		this.overdueTasks(args);
		this.groupedProjectsAndTasks(args);
		this.completed(args);
	}

	// ------ View: Dashboard.md ----- //
	viewDashboard(args) {
		const {app, dv, that} = args;
		dv.paragraph("**" + dv.page("📥 Inbox").file.link + " (" + dv.pages('"00_Meta/05_Inbox"').length + ")**");
		dv.paragraph("**" + dv.page("☀️ Today").file.link + "**");
		dv.paragraph("**" + dv.page("📅 Upcoming").file.link + "**");
		dv.paragraph("**" + dv.page("🔄 Repeating").file.link + "**");
		dv.paragraph("**" + dv.page("📔 Logbook").file.link + "**");

		let areas = dv.pages("#area")
			.where(p => (p.file.name != dv.current().file.name))
			.sort(p => p.file.path,'asc');
			
		const getArea = a => dv.page(a).file.tags.includes("#area") ? a : dv.page(a).area.path;

		for (let area of areas) {
			let [level,icon] = (area.area ? [3,"🗃"] : [2,"🗄"]);
			dv.header(level, dv.fileLink(area.file.path, false, `${icon} ${area.display}`));
			let projects = dv.pages("#project")
			.where(p => (!p.completed) && (dv.page(p.area.path).file.path == area.file.path));

			for (let p of projects) {
				dv.span("⭕️ " + dv.fileLink(p.file.path, false, p.display) + "<br>");
			}
		}

		dv.paragraph("---");
		dv.paragraph("*Total Vault Size: " + dv.pages().length + "*");
	}

	// ------ View: Repeating.md ----- //
	viewRepeating(args) {
		const {app, dv, moment, that} = args;
		let grouping = that.container.createEl('ul');
		grouping.addClass("task-group");
		for (let p of dv.pages("#task")
			.where(p => p.repeat)
			.sort(p => this.sorter(p.start))
		) {
			let row = grouping.createEl('li');
			row.addClass("task-flexbox");
			let startDate = row.createEl("span");
			startDate.classList.add("task-list-item","dv-task");
			startDate.innerHTML = this.dateTimePill(p, moment, "start");
			let label = that.container.createEl('label');
			label.addClass("task-list-item");
			label.addClass("dv-label");
			label.innerHTML = `<a class="internal-link" href="${p.file.path}">${p.file.name}</a>`;
			row.appendChild(label);
			row.createEl("span").innerHTML = this.dateTimePill(p, moment, "due");
		}
	}

	// ----- View: Upcoming.md -----//
	viewUpcoming(args) {
		const {app, dv, that, moment} = args;
		let sorted = {"byDay": [], "byMonth": [], "byYear": []};
		
		function groupbyDate(p,type,tag) {
			let date = tag.includes("#task") ? p.start.path : (p.due ? p.due.path : p.start.path);
			let format = {"byDay": "YYYY-MM-DD", "byMonth": "YYYY-MM", "byYear": "YYYY"}
			return moment(date).format(format[type]);
		}
		
		const sort = (items) => {
			const f = (momt) => momt.format("YYYY-MM-DD");
			const iDate = (i) => i.file.tags.includes("#task") ? i.start.path : (i.due ? i.due.path : i.start.path);
			const bydays = (i) => (f(moment()) < iDate(i)) && (iDate(i) <= f(moment().add(7,'days')));
			const bymonths = (i) => (f(moment().add(7,'days')) < iDate(i)) && (iDate(i) <= f(moment().add(5,'months')));
		  	const byyears = (i) => iDate(i) > f(moment().add(5,'months'));
		  	for (let i of items) {
				if (byyears(i)) { sorted.byYear.push(i) }
				else if (bydays(i)) { sorted.byDay.push(i) }
				else if (bymonths(i)) { sorted.byMonth.push(i) }
		  	}
		}
		
		let tasks = dv.pages("#task")
			.where(p => !(p.completed) && (p.start) && (p.start.path > moment().format("YYYY-MM-DD")) && (!(p.due) || (p.due.path > moment().format("YYYY-MM-DD"))));
		
		let projects = dv.pages("#project")
			.where(p => !(p.completed) && (p.start));
		  
		sort(tasks);
		sort(projects);
		
		if (sorted.byDay) {
			for (let day of dv.array(sorted.byDay)
			  .groupBy(p => groupbyDate(p,"byDay",p.file.tags))) {
				this.getTaskList({
					...args,
					filterFn: d => d,
					getSortProp: d => this.sorter(d.due),
					sortOrder: "asc",
					mapItems: d => d,
					prependHeaderLevel: 2,
					prependText: (day.key == moment().add(1,'days').format("YYYY-MM-DD")) ? moment(day.key).format("DD") + " Tomorrow" : moment(day.key).format("DD dddd"),
					dvArray: day.rows
			  	});
			}
		}
		
		if (sorted.byMonth) {
			for (let day of dv.array(sorted.byMonth)
			  .groupBy(p => groupbyDate(p,"byMonth",p.file.tags))) {
				this.getTaskList({
					...args,
					filterFn: d => d,
					getSortProp: d => d.start,
					sortOrder: "asc",
					mapItems: d => d,
					prependHeaderLevel: 2,
					prependText: moment(day.key).format("MMMM"),
					dvArray: day.rows,
					includeStart: true
				});
			}
		}
		
		if (sorted.byYear) {
			for (let day of dv.array(sorted.byYear)
			  .groupBy(p => groupbyDate(p,"byYear",p.file.tags))) {
				this.getTaskList({
					...args,
					filterFn: d => d,
					getSortProp: d => d.start,
					sortOrder: "asc",
					mapItems: d => d,
					prependHeaderLevel: 2,
					prependText: day.key,
					dvArray: day.rows,
					includeStart: true
			  	});
			}
		}
	}

	// ********** MODULES ********** //

	// ------ Tasks and Projects for Date ----- //
	groupedProjectsAndTasks(args) {
		const { app, moment, dv, date, that } = args;
		const overdue = (p) => !(p.completed) && (p.due) && (moment(p.due.path).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD"));
		const finalDate = date ?? dv.current().file.name;

		const groupByProjectOrArea = (p) => p.project ? p.project.path : (p.area ? p.area.path : "N/A");

		const getGroupSort = (key) => dv.page(key).file.path;
		
		let tasks = !date 
			? dv.pages("#task or #project")
			.where(p => !p.completed && !p.start && !p.due)
			: dv.pages("#task or #project")
			.where(p => !p.completed && p.start && p.start.path <= finalDate.format("YYYY-MM-DD") && (!p.due || p.due.path >= finalDate.format("YYYY-MM-DD")));
		
		if (tasks) {
			for (let item of dv.array(tasks)
			  .groupBy(item => groupByProjectOrArea(item))
			  .sort(item => getGroupSort(item.key), "asc")) {
			  	this.getTaskList({
				  ...args,
				  filterFn: i => i,
				  getSortProp: i => i.start,
				  sortOrder: "asc",
				  mapItems: i => i,
				  prependHeaderLevel: 2,
				  prependText: dv.page(item.key) ? dv.fileLink(dv.page(item.key).file.path, false, this.typeCheck(dv.page(item.key).file.tags) + " " + dv.page(item.key).display) : "N/A",
				  dvArray: item.rows
			  	});
		    }
		}
	}

	// ------ New Tasks for Daily Note ----- //
	newTasks(args) {
		const { moment, dv, date, that } = args;
		const finalDate = date ?? dv.current().file.name;
		
		return this.getTaskList({
			...args,
			filterFn: t => !(t.completed) && (t.start) && (t.start.path == finalDate),
			getSortProp: t => "",
			sortOrder: "",
			mapItems: t => t,
			prependHeaderLevel: 2,
			prependText: "New Tasks",
			source: `#task or #project`
		  })
	}

	// ---------- Due Tasks for Daily Note -------- //
	dueTasks(args) {
		const { moment, dv, date, that } = args;

		return this.getTaskList({
			...args,
			source: "#task or #project",
			filterFn: p => !(p.completed) && (p.due) && (p.due.path == dv.current().file.name),
			mapItems: p => p, //this.typeCheck(p.file.tags) + " " + dv.fileLink(p.file.path,false,p.display),
			getSortProp: t => "",
			sortOrder: "",
			prependText: "Due",
			prependHeaderLevel: 2
		})
	}

	// ---------- Events for Daily Note -------- //
	events(args) {
		const { luxon, moment, dv, date, that, viewToday } = args;
		const parent = dv.current();
		const finalDate = date ?? parent.file.name;
		const filter = viewToday
			? p => luxon.DateTime.fromISO(p.file.day).toFormat("yyyy-MM-dd") == finalDate && p.file.name != finalDate
			: p => p.file.outlinks.includes(parent.file.link) && p.file.tags.length
		const parentType = parent.file.tags.includes("#project") ? "project" : (parent.file.tags.includes("#area") ? "area" : (parent.file.folder == "80_PKM/85_People" ? "person" : "other"));

		return this.getDateList({
			...args,
			source: '"00_Meta/06_Logbook"',
			filterFn: filter,
			mapItems: p => p,
			getSortProp: p => p.file.day,
			sortOrder: parentType == "other"  ? "asc" : "desc",
			prependText: parentType == "person" ? "Interactions" : "Events",
			prependHeaderLevel: 2
		})
	}

	// ---------- Reminders/Backlinks/Mentions for Daily Note -------- //
	reminders(args) {
		const { luxon, moment, dv, date, that, source } = args;
		const finalDate = date ?? dv.current().file.name;

		if (!dv.page(finalDate)) {
			dv.header(2, "Warning");
			dv.paragraph("Can't show reminders when daily note doesn't exist.");
			return
		}

		return this.getSimpleList({
			...args,
			filterFn: p => !p.file.tags.includes("#task") && !p.file.tags.includes("#project") && (luxon.DateTime.fromISO(p.file.day).toFormat("yyyy-MM-dd") != finalDate),
			mapItems: p => p.file.link,
			getSortProp: t => "",
			sortOrder: "",
			prependText: "Mentions",
			prependHeaderLevel: 2,
			source: `[[${finalDate}]]`
		})
	}

	// ---------- Completed for Daily Note -------- //
	completed(args) {
		const { moment, dv, date, that } = args;
		const finalDate = date ?? dv.current().file.day;
		const printDate = (x) => this.dateTimePill(x, moment, "completed");

		return this.getTaskList({
			...args,
			filterFn: p => p.completed && p.completed.path == moment(finalDate).format("YYYY-MM-DD"),
			mapItems: p => p,
			getSortProp: p => p.file.ctime,
			sortOrder: "asc",
			prependHeaderLevel: 2,
			prependText: "Completed",
			checked: true,
			source: `#task or #project`
		})
	}

	//  ---------- Created for Daily Note -------- //
	created(args) {
		const { moment, luxon, dv, date, that } = args;
		const thisDate = date ?? luxon.DateTime.fromISO(dv.current().file.name).toFormat("yyyy-MM-dd");
		const getDate = (dt) => luxon.DateTime.fromISO(dt).toFormat("yyyy-MM-dd");

		return this.getList({
			...args,
			filterFn: p => p.file.name != thisDate
				&& getDate(p.file.ctime) == thisDate
		  		&& getDate(p.file.day) != thisDate,
			mapItems: p => p.file.link,
			getSortProp: p => p.file.ctime,
			sortOrder: "asc",
			prependHeaderLevel: 2,
			prependText: "Created",
			source: ""
		})
	}

	// ---------- Mentions for Person Note -------- //
	mentions(args) {
		const { luxon, moment, dv, date, that, source } = args;

		return this.getSimpleList({
			...args,
			filterFn: p => p.file.folder != "00_Meta/06_Logbook",
			mapItems: p => dv.fileLink(p.file.path, false, p.display ? p.display : p.file.name),
			getSortProp: t => "",
			sortOrder: "",
			prependText: "Mentions",
			prependHeaderLevel: 2,
			source: `[[${dv.current().file.name}]]`
		})
	}


	// ---------- Alternate Overdue Tasks for Today View -------- //
	overdueTasks(args) {
		const { moment, dv, date, that } = args;

		return this.getTaskList({
			...args,
			filterFn: p => !(p.completed) && (p.due) && (moment(p.due.path).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")),
			getSortProp: p => this.sorter(p.due, dv),
			sortOrder: "asc",
			// mapItems: p => { return {"path": p.file.path, "tags": p.file.tags, "display": dv.fileLink(p.file.path, false, p.display) + (p.due ? " ❗️<span style='color:red;'>" + moment(p.due.path).format("MMM D") +  "</span>" : "")} },
			mapItems: p => p,
			prependText: "Overdue",
			prependHeaderLevel: 2,
			source: `#task or #project`
		})
	}

	// ---------- Tasks for Project/Area -------- //
	taskGroup(args) {
		const { moment, dv, that, source } = args;

		return this.getTaskList({
			...args,
			filterFn: p => p.file.tags.includes("#task")
				&& !p.file.tags.includes("#project")
				&& (p.project ? p.project.path == dv.current().file.name : (p.area ? p.area.path == dv.current().file.name : ""))
				&& !p.completed,
			mapItems: p => p,
			getSortProp: p => p.start ? p.start.path : (p.due ? p.due.path : p.file.name),
			sortOrder: "asc",
			prependText: "Tasks",
			prependHeaderLevel: 2,
			checked: false,
			source: source ? source : `"${dv.current().file.folder}"`
		})
	}

	// ---------- Projects for Project/Area -------- //
	projectGroup(args) {
		const { moment, dv, that, source } = args;

		return this.getTaskList({
			...args,
			filterFn: p => p.file.tags.includes("#project")
				&& !p.file.tags.includes("#task")
				&& (p.project ? p.project.path == dv.current().file.name : (p.area ? p.area.path == dv.current().file.name : ""))
				&& !p.completed,
			mapItems: p => p, //this.typeCheck(p.file.tags) + " " + dv.fileLink(p.file.path,false,p.display) + (p.due ? " ⚑" + moment(p.due.path).format("M/D") : ""),
			getSortProp: p => p.start ? p.start.path : (p.due ? p.due.path : p.file.name),
			sortOrder: "asc",
			prependText: "Projects",
			prependHeaderLevel: 2,
			source: source ? source : `"${dv.current().file.folder}"`
		})
	}

	noteGroup(args) {
		const { moment, dv, that, source, sortProp, sortOrder, prependText, headerLevel } = args;

		return this.getDividerList({
			...args,
			filterFn: p => !p.file.tags.includes("#project")
				&& !p.file.tags.includes("#task")
				&& !p.file.tags.includes("#area"),
			mapItems: p => p.file.link,
			getSortProp: sortProp ? sortProp : p => p.file.mtime,
			sortOrder: sortOrder? sortOrder: "desc",
			prependText: prependText? prependText: "Notes",
			prependHeaderLevel: headerLevel? headerLevel: 2,
			source: source ? source : `"${dv.current().file.folder}"`
		})
	}

	// ---------- Projects for Project/Area -------- //
	completedGroup(args) {
		const { moment, dv, that, source } = args;
		const finalDate = (x) => this.dateTimePill(x, moment, "completed");

		return this.getTaskList({
			...args,
			filterFn: p => (p.file.tags.includes("#project")
				|| p.file.tags.includes("#task"))
				&& (p.project ? p.project.path == dv.current().file.name : (p.area ? p.area.path == dv.current().file.name : ""))
				&& p.completed,
			mapItems: p => p,
			getSortProp: p => p.completed ? p.completed.path : "",
			sortOrder: "desc",
			prependText: "Completed",
			prependHeaderLevel: 2,
			checked: true,
			source: source ? source : `"${dv.current().file.folder}"`
		})
	}

	subAreas(args) {
		const { dv, that, source, sortProp, sortOrder, prependText, headerLevel } = args;

		return this.getDividerList({
			...args,
			filterFn: p => p.file.tags.includes("#area")
				&& !p.file.tags.includes("#project")
				&& p.file.name != dv.current().file.name,
			mapItems: p => dv.fileLink(p.file.path,false,"🗃 " + p.display),
			getSortProp: sortProp ? sortProp : p => p.file.path,
			sortOrder: sortOrder? sortOrder: "asc",
			prependText: prependText? prependText: "Areas",
			prependHeaderLevel: headerLevel? headerLevel: 2,
			source: source ? source : `"${dv.current().file.folder}"`
		});
	}



	// ********** RENDER METHODS ********** //	

	// ------ Task/Project List Generator  ----- //
	getList(args) {
		const {
			that,
			app,
			dv,
			moment,
			source,
			filterFn,
			mapItems,
			getSortProp,
			sortOrder,
			prependText,
			prependHeaderLevel
			} = args;
			
		const pages = dv.pages(source).where(filterFn).sort(getSortProp, sortOrder).map(mapItems)
		if (pages.length === 0) {
			return
		}
		if (prependText) {
			dv.header(prependHeaderLevel, prependText)
		}
		for (let p of pages) {
			dv.span(p + "<br>");
		}
	}

	// ------ Simple List with each file separated by an HR ----- // 
	getDividerList(args) {
		const {
			that,
			app,
			dv,
			moment,
			source,
			filterFn,
			mapItems,
			getSortProp,
			sortOrder,
			prependText,
			prependHeaderLevel
			} = args;
			
		const pages = dv.pages(source).where(filterFn).sort(getSortProp, sortOrder).map(mapItems)
		if (pages.length === 0) {
			return
		}
		if (prependText) {
			dv.header(prependHeaderLevel, prependText)
		}
		for (let p of pages) {
			dv.span(p + "<hr style='padding:0;margin:-10px 0;border-width: 1px 0 0 0;'>");
		}
	}

	// ------ Task/Project List Generator WITH Checkboxes ----- //
	getTaskList(args) {
		const {
			that,
			app,
			dv,
			moment,
			source,
			filterFn,
			mapItems,
			getSortProp,
			sortOrder,
			prependText,
			prependHeaderLevel,
			checked,
			dvArray,
			includeStart
			} = args;

		const pages = dvArray
			? dvArray.where(filterFn).sort(getSortProp, sortOrder).map(mapItems)
			: dv.pages(source).where(filterFn).sort(getSortProp, sortOrder).map(mapItems)
		if (pages.length === 0) {
			return
		}
		if (prependText) {
			dv.header(prependHeaderLevel, prependText);
		}
		let grouping = that.container.createEl('ul');
		grouping.addClass("task-group");
		for (let p of pages) {
			let startDate = includeStart && p.start ? this.dateTimePill(p, moment, "start") : "";
			let task = p.file.tags.includes("#task");
			let project = p.file.tags.includes("#project");
			let row = grouping.createEl('li');
			row.addClass("task-flexbox");
			let label = that.container.createEl('label');
			label.classList.add("task-list-item","dv-label","cm-formatting-link","cm-formatting-link-start");
			if (checked) {
				label.addClass("dv-checked");
			}
			row.appendChild(this.checkboxMaker({ ...args, fpath: p.file.path, checked }));
			label.innerHTML = `${startDate} <a class="internal-link" href="${p.file.path}">${project ? "<b>" : ""}${p.display ? p.display : p.file.name}${project ? "</b>" : ""}</a>`;
			row.appendChild(label);
			if (p.completed) {
				row.createEl("span").innerHTML = this.dateTimePill(p, moment, "completed");
			} else if (p.due) {
				row.createEl("span").innerHTML = this.dateTimePill(p, moment, "due");
			}
		}
	}

	// ------ Events and Other Date Lists  ----- //
	getDateList(args) {
		const {
			that,
			app,
			dv,
			moment,
			luxon,
			source,
			filterFn,
			mapItems,
			getSortProp,
			sortOrder,
			prependText,
			prependHeaderLevel,
		} = args;

		const displayTitle = (title) => title.replace(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g,"").trim();
		const parent = dv.current();
		const parentType = parent.file.tags ? (parent.file.tags.includes("#project") ? "project" : (parent.file.tags.includes("#area") ? "area" : (parent.file.folder == "80_PKM/85_People" ? "person" : "other"))) : "other";
		
		const events = dv.pages(source).where(filterFn).sort(getSortProp, sortOrder).map(mapItems);
		if (events.length === 0) {
			return
		}
		if (prependText) {
			dv.header(prependHeaderLevel, prependText);
		}
		
		let grouping = that.container.createEl('ul');
		grouping.addClass("task-group");
		for (let p of events) {
			let date = (parentType == "project" || parentType == "area" || parentType == "person")
				? p
				: (p.time ? p.time : "All Day");
			let row = grouping.createEl('li');
			row.addClass("task-flexbox");
			let datePill = row.createEl("span");
			datePill.classList.add("task-list-item","dv-task");
			datePill.innerHTML = this.dateTimePill(date, moment, "event");
			let label = row.createEl('label');
			label.addClass("task-list-item");
			label.addClass("dv-label");
			label.innerHTML = `<a class="internal-link" href="${p.file.path}">${displayTitle(p.file.name)}</a>`;
		}
	}

	// ------ Standard List Generator ----- //
	getSimpleList(args) {
		const {
			that,
			app,
			dv,
			moment,
			filterFn,
			mapItems,
			getSortProp,
			sortOrder,
			prependText,
			prependHeaderLevel,
			source
			} = args;

		const pages = dv.pages(source).where(filterFn).sort(getSortProp, sortOrder).map(mapItems)
		if (pages.length != 0) {
			if (prependText) {
				dv.header(prependHeaderLevel, prependText)
			}
			dv.list(pages);
		}
	}
}