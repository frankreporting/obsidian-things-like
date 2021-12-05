module.exports = async function markCompleted(params) {
    const {app} = params;

    const dv = app.plugins.plugins["dataview"].api;
    const file = await app.workspace.getActiveFile();
    const page = dv.page(file.path);
    let checked = page.completed ? true : (page.lastCompleted ? (page.start ? moment(page.start.path).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD") : true) : false);
    const format = (date) => date.format("YYYY-MM-DD");
    const today = moment(moment().format("YYYY-MM-DD"));
    const {update, getPropertiesInFile} = app.plugins.plugins["metaedit"].api;
    const props = await getPropertiesInFile(file);
    const completedFieldExists = props.map(p => p.key).includes("completed");
    const lastCompletedFieldExists = props.map(p => p.key).includes("lastCompleted");
    const startFieldExists = props.map(p => p.key).includes("start");
    const lastRepeatFieldExists = props.map(p => p.key).includes("lastRepeat");
    const dueFieldExists = props.map(p => p.key).includes("due");
    const startString = props.filter(p => p.key === "start")[0]?.content.replace("[[","").replace("]]","");
    const start = startString ? moment(startString) : null;
    const repeat = props.filter(p => p.key === "repeat")[0]?.content;
    const lastRepeatString = props.filter(p => p.key === "lastRepeat")[0]?.content;
    const lastRepeat = lastRepeatString ? moment(lastRepeatString) : null;
    const dueAfter = props.filter(p => p.key === "dueAfter")[0]?.content;
    const newStart = resetStart();
    const newDue = resetDue();
    const newCompleted = checked ? "" : (repeat ? format(today) : "[[" + format(today) + "]]");

    if (repeat) {
        if (newStart) {
            if (startFieldExists) {
                await update("start", "[[" + format(newStart) + "]]", file);
            }
            if (lastRepeatFieldExists) {
                await update("lastRepeat", format(newStart), file);
            }
        }
        if (newDue) {
            if (dueFieldExists) {
                await update("due", newDue, file);
            }
        }
        if (lastCompletedFieldExists) {
            await update("lastCompleted", newCompleted, file);
        }
    } else {
        if (completedFieldExists) {
            await update("completed", newCompleted, file);
        }
    }

    function resetDue() {
        if (dueAfter) {
            if (newStart) {
                let newDue = moment(format(newStart));
                return "[[" + format(newDue.add(dueAfter, 'days')) + "]]";
            }
        }
        return "";
    }

    function resetStart() {
        let date = null;
        if (repeat) {
            if (lastRepeatFieldExists || start) {
                switch (repeat) {
                    case "daily":
                        date = calcDate(1, 'days');
                        break;
                    case "weekly":
                        // date = updateStart(moment(dateFrom).add(1, 'weeks'), 1, 'weeks');
                        date = calcDate(1, 'weeks');
                        break;
                    case "biweekly":
                        // date = updateStart(moment(dateFrom).add(2, 'weeks'), 2, 'weeks');
                        date = calcDate(2, 'weeks');
                        break;
                    case "monthly":
                        // date = updateStart(moment(dateFrom).add(1, 'months'), 1, 'months');
                        date = calcDate(1, 'months');
                        break;
                    case "bimonthly":
                        // date = updateStart(moment(dateFrom).add(2, 'months'), 2, 'months');
                        date = calcDate(2, 'months');
                        break;
                    case "quarterly":
                        // date = updateStart(moment(dateFrom).add(1, 'quarters'), 1, 'quarters');
                        date = calcDate(1, 'quarters');
                        break;
                    case "annually":
                        // date = updateStart(moment(dateFrom).add(1, 'years'), 1, 'years');
                        date = calcDate(1, 'years');
                        break;
                    default:
                        break;
                }
            }
        }
        return date;
    }

    function calcDate(count, duration) {
        let dateFrom = lastRepeatFieldExists ? lastRepeat : (start ? start : null);
        let operation = checked ? "subtract" : "add";
        return dateFrom ? updateStart(format(moment(dateFrom)[operation](count, duration)), count, duration) : "";
    }

    function updateStart(nearestInstance, incrementBy, time) {
        if (!checked) {
            if (start) {
                if (start.isAfter(today, 'day')) {
                    return null;
                } 
            }
            let next = moment(nearestInstance);
            if (!next.isAfter(today)) {
                while (next.isSameOrBefore(today)) {
                    next = next.add(incrementBy, time);
                }
            }
            return next;
        } else {
            let prev = moment(nearestInstance);
            if (prev.isAfter(today)) {
                while (prev.isAfter(today)) {
                    prev = prev.subtract(incrementBy, time);
                }
            } 
            else if (prev.isBefore(today)) {
                while (prev.isBefore(today)) {
                    prev = prev.add(incrementBy, time);
                }
            }
            return prev;
        }
    }
}