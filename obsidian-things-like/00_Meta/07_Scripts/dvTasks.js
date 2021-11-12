class DvTasks {

	// ------- Utilities ------ //
	checkboxMaker(args) {
		const {
			that,
			app,
			pn,
			pv,
			fpath,
			moment,
			markComplete
		} = args;
		const checkbox = that.container.createEl('input')
		checkbox.type = "checkbox";
		checkbox.addClass("task-list-item");
		checkbox.id = fpath;
		checkbox.style["height"] = "1.1em";
		checkbox.style["width"] = "1.1em";
		checkbox.style["verticalAlign"] = "sub";
		checkbox.style["marginLeft"] = "0";
		const file = that.app.vault.getAbstractFileByPath(fpath);
		checkbox.addEventListener('click', async(evt) => {
			// evt.preventDefault();
			// await update(pn, pv, file);
			await markComplete({app, file, moment, that});
		});
		return checkbox;
	}

	dateTimeHighlight(x, luxon) {
		let dtInstance = x;
		if ((x instanceof luxon.DateTime)) {
			dtInstance = x.toFormat("MMM d");
		}
		return `<span style='background-color:#ddd;color:#666;border-radius:6px;font-size:0.7em;padding:1px 5px;vertical-align:text-bottom;margin-right:4px;'>` + dtInstance + `</span> `
	} 
	
	typeCheck(tags) {
		const project = tags.includes("#project");
		const task = tags.includes("#task");
		const area = tags.includes("#area");
		let icon = task ? "<span style='font-size: 1.1em;'><b>⃝</b></span> " : (project ? "⭕️ " : (area ? "🗄 " : ""));
		return icon;
	}

	sorter(day, dv) {
		return !day ? "Some Day" : day.path;
	}
	
	// ------ TEMPLATE: Log for Daily Note ----- //
	dailyLog(args) {
		this.newTasks(args);
		this.dueTasks(args);
		this.events(args);
		this.reminders(args);
		this.completed(args);
		this.created(args);
	}

	// ------ TEMPLATE: Area or Project ----- //
	areaOrProject(args) {
		this.subAreas(args);
		this.projectGroup(args);
		this.taskGroup(args);
		this.noteGroup(args);
		this.completedGroup(args);
	}

	// ----- Safely parse dates even w/o daily notes ----- //
	parseD(dtStr) {
		if (!dtStr) { return }
		// try { return dtStr.path } 
		// catch {
		// 	console.log(dtStr);
		// }
		return dtStr.path;
	}

	// ----- Print whatever for debugging ----- //
	debug(args) {
		const { luxon, dv, date, that } = args;
		dv.paragraph(this.parseD(dv.current().start));
	}

	// ------ New Tasks for Daily Note ----- //
	newTasks(args) {
		const { luxon, dv, date, that } = args;
		const finalDate = date ?? dv.current().file.name;
		
		return this.getList({
			...args,
			filterFn: t => !(t.completed) && (t.start) && (t.start.path == finalDate),
			getSortProp: t => "",
			sortOrder: "",
			mapItems: t => this.typeCheck(t.file.tags) + " " + dv.fileLink(t.file.path, false, t.display) + (t.due ? " » " + luxon.DateTime.fromISO(t.due.path).toFormat('MMM d') : ""),
			prependHeaderLevel: 2,
			prependText: "New Tasks"
		  })
	}

	// ---------- Due Tasks for Daily Note -------- //
	dueTasks(args) {
		const { luxon, dv, date, that } = args;

		return this.getList({
			...args,
			filterFn: p => !(p.completed) && (p.due) && (p.due.path == dv.current().file.name),
			mapItems: p => this.typeCheck(p.file.tags) + " " + dv.fileLink(p.file.path,false,p.display),
			getSortProp: t => "",
			sortOrder: "",
			prependText: "Due",
			prependHeaderLevel: 2
		})
	}

	// ---------- Events for Daily Note -------- //
	events(args) {
		const { luxon, dv, date, that } = args;
		const finalDate = date ?? dv.current().file.name;
		const displayTitle = (title) => title.replace(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g,"").trim();

		const events = dv.pages('"00_Meta/06_Logbook"')
			.where(p => (p.file.name != luxon.DateTime.fromISO(finalDate).toFormat("yyyy-MM-dd")) && (luxon.DateTime.fromISO(p.file.day).toFormat("yyyy-MM-dd") == luxon.DateTime.fromISO(finalDate).toFormat("yyyy-MM-dd")))
			.map(p => (p.time ? this.dateTimeHighlight(p.time, luxon) : "") + dv.fileLink(p.file.path, false, displayTitle(p.file.name)));
			// .sort(p => p.file.ctime, "asc");
		
		if (events.length != 0) {
			dv.header(2, "Events");
			for (let e of events) {
				dv.span(e);
			}
		}
	}

	// ---------- Reminders/Backlinks/Mentions for Daily Note -------- //
	reminders(args) {
		const { luxon, dv, date, that, source } = args;
		const finalDate = date ?? dv.current().file.name;

		if (!dv.page(finalDate)) {
			dv.header(2, "Warning");
			dv.paragraph("Can't show reminders when daily note doesn't exist.");
			return
		}

		return this.getSimpleList({
			...args,
			filterFn: p => !(dv.func.contains(p.tags,"task")) && !(dv.func.contains(p.tags,"project")) && (luxon.DateTime.fromISO(p.file.day).toFormat("yyyy-MM-dd") != luxon.DateTime.fromISO(finalDate).toFormat("yyyy-MM-dd")),
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
		const { luxon, dv, date, that } = args;
		const finalDate = date ?? dv.current().file.day;

		return this.getList({
			...args,
			filterFn: p => (p.completed) && (luxon.DateTime.fromISO(p.completed.path).toFormat("yyyy-MM-dd") == luxon.DateTime.fromISO(finalDate).toFormat("yyyy-MM-dd")),
			mapItems: p => "<span style='font-size: 1.3em;'>✓⃝ <span style='vertical-align: middle; text-decoration: line-through; font-size: var(--font-normal);'>" + p.file.link + "</span></span>",
			getSortProp: p => p.file.ctime,
			sortOrder: "asc",
			prependHeaderLevel: 2,
			prependText: "Completed",
			source: `#task or #project`
		})
	}

	//  ---------- Created for Daily Note -------- //
	created(args) {
		const { luxon, dv, date, that } = args;
		const thisDate = date ?? luxon.DateTime.fromISO(dv.current().file.name);
		const getDate = (dt) => luxon.DateTime.fromISO(dt);
		const tomorrow = luxon.DateTime.now().plus({days: 1});

		return this.getList({
			...args,
			filterFn: p => (p.file.name != thisDate.toFormat("yyyy-MM-dd"))
				&& (getDate(p.file.ctime).toFormat("yyyy-MM-dd") == thisDate.toFormat("yyyy-MM-dd"))
		  		&& (getDate(p.file.day).toFormat("yyyy-MM-dd") != thisDate.toFormat("yyyy-MM-dd")),
			mapItems: p => p.file.link,
			getSortProp: p => p.file.ctime,
			sortOrder: "asc",
			prependHeaderLevel: 2,
			prependText: "Created",
			source: ""
		})
	}


	// ---------- Alternate Overdue Tasks for Today View -------- //
	overdueTasks(args) {
		const { luxon, dv, date, that } = args;

		return this.getTaskList({
			...args,
			filterFn: p => !(p.completed) && (p.due) && (p.due.path < luxon.DateTime.now().toISODate()),
			getSortProp: p => this.sorter(p.due, dv),
			sortOrder: "asc",
			mapItems: p => { return {"path": p.file.path, "display": dv.fileLink(p.file.path, false, p.display) + (p.due ? " ❗️<span style='color:red;'>" + luxon.DateTime.fromISO(p.due.path).toFormat("MMM d") +  "</span>" : "")} },
			prependText: "Overdue",
			prependHeaderLevel: 2
		})
	}

	// ---------- Overdue Tasks for Today View -------- //
	oldOverdueTasks(args) {
		const { luxon, dv, date, that } = args;
		const { update } = app.plugins.plugins["metaedit"].api;
		const buttonMaker = (pn, pv, fpath) => {
			const btn = that.container.createEl('input', {"type": "checkbox"});
			btn.style["cursor"] = "pointer";
			const file = that.app.vault.getAbstractFileByPath(fpath);
			btn.addEventListener('click', async(evt) => {
				evt.preventDefault();
				await update(pn, pv, file);
			});
			return btn;
		}

		return this.getList({
			...args,
			filterFn: p => !(p.completed) && (p.due) && (p.due.path < luxon.DateTime.now().toISODate()),
			getSortProp: p => this.sorter(p.due, dv),
			sortOrder: "asc",
			// mapItems: p => this.typeCheck(p.file.tags) + dv.fileLink(p.file.path, false, p.display) + (p.due ? " ❗️<span style='color:red;'>" + luxon.DateTime.fromISO(p.due.path).toFormat("MMM d") +  "</span>" : ""),
			mapItems: p => buttonMaker("completed", "[[" + luxon.DateTime.now().toFormat("yyyy-MM-dd") + "]]", p.file.path) + dv.fileLink(p.file.path, false, p.display) + (p.due ? " ❗️<span style='color:red;'>" + luxon.DateTime.fromISO(p.due.path).toFormat("MMM d") +  "</span>" : ""),
			prependText: "Overdue",
			prependHeaderLevel: 2
		})
	}

	// ---------- Tasks for Project/Area -------- //
	taskGroup(args) {
		const { luxon, dv, that, source } = args;

		return this.getList({
			...args,
			filterFn: p => ((dv.func.contains(p.tags,"task"))
				&& !(dv.func.contains(p.tags,"project"))
				&& (p.area ? p.area.path == dv.current().file.name : (p.project ? p.project.path == dv.current().file.name : "")))
				&& !(p.completed),
			mapItems: p => this.typeCheck(p.file.tags) + " " + dv.fileLink(p.file.path,false,p.display) + (p.due ? " » " + luxon.DateTime.fromISO(p.due.path).toFormat("MMM d") : ""),
			getSortProp: p => p.start ? p.start.path : (p.due ? p.due.path : p.file.name),
			sortOrder: "asc",
			prependText: "Tasks",
			prependHeaderLevel: 2,
			source: source ? source : `"${dv.current().file.folder}"`
		})
	}

	// ---------- Projects for Project/Area -------- //
	projectGroup(args) {
		const { luxon, dv, that, source } = args;

		return this.getList({
			...args,
			filterFn: p => ((dv.func.contains(p.tags,"project")) 
				&& !(dv.func.contains(p.tags,"task")) 
				&& (p.area ? p.area.path == dv.current().file.name : (p.project ? p.project.path == dv.current().file.name : "")))
				&& !(p.completed),
			mapItems: p => this.typeCheck(p.file.tags) + " " + dv.fileLink(p.file.path,false,p.display) + (p.due ? " » " + luxon.DateTime.fromISO(p.due.path).toFormat("MMM d") : ""),
			getSortProp: p => p.start ? p.start.path : (p.due ? p.due.path : p.file.name),
			sortOrder: "asc",
			prependText: "Projects",
			prependHeaderLevel: 2,
			source: source ? source : `"${dv.current().file.folder}"`
		})
	}

	noteGroup(args) {
		const { luxon, dv, that, source } = args;

		return this.getSimpleList({
			...args,
			filterFn: p => !(dv.func.contains(p.tags,"project"))
				&& !(dv.func.contains(p.tags,"task"))
				&& !(dv.func.contains(p.tags,"area"))
				&& (p.file.folder == dv.current().file.folder),
			mapItems: p => p.file.link,
			getSortProp: p => p.file.mtime,
			sortOrder: "desc",
			prependText: "Notes",
			prependHeaderLevel: 2,
			source: source ? source : `"${dv.current().file.folder}"`
		})
	}

	// ---------- Projects for Project/Area -------- //
	completedGroup(args) {
		const { luxon, dv, that, source } = args;
		const finalDate = (x) => this.dateTimeHighlight(luxon.DateTime.fromISO(x), luxon);

		return this.getList({
			...args,
			filterFn: p => ((dv.func.contains(p.tags,"project") 
				|| (dv.func.contains(p.tags,"task")))
				&& (p.area ? p.area.path == dv.current().file.name : (p.project ? p.project.path == dv.current().file.name : ""))
				&& p.completed),
			mapItems: p => dv.func.contains(p.file.tags,"project") ? "🔴 " + finalDate(p.completed.path) + " " + dv.fileLink(p.file.path, false, p.display) 
				: (dv.func.contains(p.file.tags,"task") ? "✅ " + finalDate(p.completed.path) + " " + p.file.link : finalDate(p.completed.path) + " " + p.file.link),
			getSortProp: p => p.completed ? p.completed.path : "",
			sortOrder: "desc",
			prependText: "Completed",
			prependHeaderLevel: 2,
			source: source ? source : `"${dv.current().file.folder}"`
		})
	}

	subAreas(args) {
		const { luxon, dv, that, source } = args;

		const areas = dv.pages(`"${dv.current().file.folder}"`)
			.where(p => (dv.func.contains(p.tags,"area"))
				&& !(dv.func.contains(p.tags,"project"))
				&& (p.file.name != dv.current().file.name))
			.map(p => dv.fileLink(p.file.path,false,p.display))
		
		if (areas.length === 0) {
			return
		}
		dv.header(2, "Areas");
		dv.paragraph(dv.func.join(areas.array(), " **•** "));
	}

	// ------ Task/Project List Generator  ----- //
	getList(args) {
		const {
			that,
			app,
			dv,
			luxon,
			filterFn,
			mapItems,
			getSortProp,
			sortOrder,
			prependText,
			prependHeaderLevel
			} = args;

		const pages = dv.pages("#task or #project").where(filterFn).sort(getSortProp, sortOrder).map(mapItems)
		if (pages.length === 0) {
			return
		}
		if (prependText) {
			dv.header(prependHeaderLevel, prependText)
		}
		for (let p of pages) {
			dv.span(p + '<br>');
		}
	}

	// ------ Alternate Task/Project List Generator  ----- //
	getTaskList(args) {
		const {
			that,
			app,
			dv,
			luxon,
			filterFn,
			mapItems,
			getSortProp,
			sortOrder,
			prependText,
			prependHeaderLevel
			} = args;
		// const { update } = app.plugins.plugins["metaedit"].api;
		// const checkboxMaker = (pn, pv, fpath) => {
		// 	const checkbox = that.container.createEl('input')
		// 	checkbox.type = "checkbox";
		// 	checkbox.addClass("task-list-item");
		// 	checkbox.id = fpath;
		// 	checkbox.style["height"] = "1.1em";
		// 	checkbox.style["width"] = "1.1em";
		// 	checkbox.style["verticalAlign"] = "sub";
		// 	checkbox.style["marginLeft"] = "0";
		// 	const file = that.app.vault.getAbstractFileByPath(fpath);
		// 	checkbox.addEventListener('click', async(evt) => {
		// 		evt.preventDefault();
		// 		await update(pn, pv, file);
		// 	});
		// 	return checkbox;
		// }
		const pages = dv.pages("#task or #project").where(filterFn).sort(getSortProp, sortOrder).map(mapItems)
		if (pages.length === 0) {
			return
		}
		if (prependText) {
			dv.header(prependHeaderLevel, prependText)
		}
		for (let p of pages) {
			this.checkboxMaker({
				...args,
				pn: "completed",
				pv: "[[" + luxon.DateTime.now().toFormat("yyyy-MM-dd") + "]]",
				fpath: p.path
			});
			dv.el("label", " " + p.display + "<br>");
		}
	}

	// ------ Standard List Generator  ----- //
	getSimpleList(args) {
		const {
			that,
			app,
			dv,
			luxon,
			filterFn,
			mapItems,
			getSortProp,
			sortOrder,
			prependText,
			prependHeaderLevel,
			source
			} = args;

		const pages = dv.pages(source).where(filterFn).sort(getSortProp, sortOrder).map(mapItems)
		// if (pages.length === 0) {
		// 	return
		// }
		// if (prependText) {
		// 	dv.header(prependHeaderLevel, prependText)
		// }
		// dv.list(pages);
		if (pages.length != 0) {
			if (prependText) {
				dv.header(prependHeaderLevel, prependText)
			}
			dv.list(pages);
		}
	}


	// ---------- Reminders/Backlinks/Mentions: only visible when there are results --- //
	// const day = dv.current().file.name;
	// let backlinks = dv.pages(`[[${day}]]`)
	// 	.where(p => !(dv.func.contains(p.tags,"task")) && !(dv.func.contains(p.tags,"project")))
	//   .map(p => p.file.link);
	// if (backlinks.length > 0) {
	// 	dv.header(2,"Reminders/Mentions");
	//   dv.list(backlinks);
	// }

	// ---------- Due tasks/projects for this daily note --- //
	// let tasks = dv.pages("#task","#project")
	// .where(p => !(p.completed) && (p.due) && (p.due.path == dv.current().file.name))
	// .map(p => dv.func.link(p.file.path,p.display));

	// for (let t of tasks) {
	// 	dv.paragraph(" ◻️ " + t + " \n ");
	// }




	// --------- Tasks and Projects for Today ---------- //
	// let items = [];
	
	// const groupbyProjectOrArea = (p) => p.project ? p.project.path : (p.area ? p.area.path : "");
	
	// let tasks = dv.pages("#task")
	// 	.where(p => !(p.completed) && (p.start) && (p.start.path <= moment().format("YYYY-MM-DD")) && (!(p.due) || (p.due.path > moment().format("YYYY-MM-DD"))));
	
	// let projects = dv.pages("#project")
	// 	.where(p => !(p.completed) && (p.start) && (p.start.path < moment().format("YYYY-MM-DD")));
	  
	// for (let task of tasks) {
	// 	items.push(task);
	// }
	
	// for (let project of projects) {
	// 	items.push(project);
	// }
	
	// if (items) {
	// 	for (let item of dv.array(items)
	// 	  .groupBy(item => groupbyProjectOrArea(item))) {
	// 	 let header = dv.page(item.key);
	// 		dv.header(2,dv.func.link(header.file.path,typeCheck(header.file.tags) + " " + header.display));
	// 			for (let i of item.rows) {
	// 				  dv.paragraph((dv.func.contains(i.file.tags,"#project") ? "⭕️ " + dv.func.link(i.file.path,i.display) : "◻️ " + i.file.link) + (i.due ? " » " + moment(i.due.path).format("MMM D") : "") + " \n ");
	// 	  }
	// 	}
	// }

	relDateString(d, luxon) {
	  if (!(d instanceof luxon.DateTime)) return '–'
	  const now = luxon.DateTime.now()
	  const days = Math.ceil(d.diff(now, 'days').days)
	  if (days < 0) return 'Overdue ' + d.toFormat('L/d')
	  if (days === 0) return 'Today'
	  if (days === 1) return 'Tomorrow'
	  if (days < 7) return d.toFormat('cccc')
	  return d.toFormat('ccc L/d')
	}
  
	getButtonStrings(status) {
	  const completed = status === 'Completed'
	  const btnStr = completed ? 'Undo' : 'Done'
	  const updateStr = completed ? 'To-Do' : 'Completed'
	  return { btnStr, updateStr }
	}
  
	getCustomLink(name, target) {
	  return `[[${target}|${name}]]`
	}
  
	getTodayTasks(args) {
	  const { luxon, dv, date, that } = args
	  const finalDate = date ?? dv.current().file.name
	  return this.getTasksTable({
		...args,
		filterFn: t => t.status != 'Completed' && t.dueDate && t.dueDate?.hasSame(luxon.DateTime.fromISO(finalDate), 'day')
	  })
	}
  
	getOverdueTasks(args) {
	  const { luxon, dv, date, that } = args
	  const finalDate = date ?? dv.current().file.name
	  return this.getTasksTable({
		...args,
		prependText: 'Overdue',
		filterFn: t => t.dueDate && t.dueDate < luxon.DateTime.fromISO(finalDate) && t.status != 'Completed'
	  })
	}
  
	getTasksNoDueDate(args) {
	  return this.getTasksTable({
		...args,
		prependText: 'No Due Date',
		filterFn: t => !t.dueDate
	  })
	}
  
	getTasksTable(args) {
	  const {
		that,
		app,
		dv,
		luxon,
		getSortProp = t => t.dueDate,
		sortOrder = 'asc',
		filterFn = t => t.task,
		completedCol = false,
		prependHeaderLevel = 3,
		prependText
	  } = args;
	  const { metaedit, buttons } = app.plugins.plugins
	  const { update } = metaedit.api
	  const { createButton } = buttons
  
  
	  const dueStr = completedCol ? 'Completed' : 'Due Date';
	  const pages = dv.pages("#task").sort(getSortProp, sortOrder).where(filterFn)
	  if (pages.length === 0) {
		return
	  }
  
	  if (prependText) {
		dv.header(prependHeaderLevel, prependText)
	  }
  
	  dv.table(["Name", "Category", dueStr, "", ""], pages
		.map(t => {
		  const { btnStr, updateStr } = this.getButtonStrings(t.status)
		  return [
			this.getCustomLink(t.task, t.file.name),
			t.category,
			this.relDateString(t.dueDate, luxon),
			createButton({
			  app,
			  el: that.container,
			  args: { name: btnStr },
			  clickOverride: { click: update, params: ['Status', updateStr, t.file.path] }
			}),
		  ]
		})
	  )
	}
  }