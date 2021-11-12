module.exports = async function markCompleted(params) {
    const {app} = params;
    const format = (date) => date.format("YYYY-MM-DD");
    const today = window.moment();
    const thisMonth = today.month();
    const thisYear = today.year();
    const file = app.workspace.activeLeaf.view.file.path;
    const {update, getPropertiesInFile} = app.plugins.plugins["metaedit"].api;
    const props = await getPropertiesInFile(file);
    const completedFieldExists = props.map(p => p.key).includes("completed");
    const startFieldExists = props.map(p => p.key).includes("start");
    const dueFieldExists = props.map(p => p.key).includes("due");
    const startString = props.filter(p => p.key === "start")[0]?.content.replace("[[","").replace("]]","");
    const start = startString ? moment(startString) : null;
    const repeat = props.filter(p => p.key === "repeat")[0]?.content;
    const repeatDay = props.filter(p => p.key === "repeatDay")[0]?.content;
    const dueAfter = props.filter(p => p.key === "dueAfter")[0]?.content;
    const newStart = resetStart();
    const newDue = resetDue();

    function updateStart(nearestInstance, incrementBy, time) {
        if (start) {
            if (start.isAfter(today, 'day')) {
                return null;
            } 
        }
        let next = nearestInstance;
        if (!next.isAfter(today)) {
            while (next.isSameOrBefore(today)) {
                next = next.add(incrementBy, time);
            }
        }
        return next;
    }

    function resetStart() {
        let date = null;
        if (repeat) {
            switch (repeat) {
                case "daily":
                    date = today.add(1, 'days');
                    break;
                case "weekly":
                    date = updateStart(moment().day(repeatDay), 1, 'weeks');
                    break;
                case "biweekly":
                    date = updateStart(moment().day(repeatDay), 2, 'weeks');
                    break;
                case "monthly":
                    date = updateStart(moment(thisYear + "-" + (thisMonth+1) + "-" + repeatDay, "YYYY-M-D"), 1, 'months');
                    break;
                case "bimonthly":
                    date = updateStart(moment(thisYear + "-" + (thisMonth+1) + "-" + repeatDay, "YYYY-M-D"), 2, 'months');
                    break;
                case "annually":
                    date = updateStart(moment(thisYear + "-" + repeatDay, "YYYY-MM-DD"), 1, 'years');
                    break;
                default:
                    break;
            }
        }
        return date;
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
    
    if (repeat) {
        if (newStart) {
            if (startFieldExists) {
                await update("start", "[[" + format(newStart) + "]]", file);
            }
        }
        if (newDue) {
            if (dueFieldExists) {
                await update("due", newDue, file);
            }
        }
    } else {
        if (completedFieldExists) {
            await update("completed", "[[" + format(today) + "]]", file);
        }
    }
}