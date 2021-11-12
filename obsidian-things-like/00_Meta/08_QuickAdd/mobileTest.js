module.exports = async function markCompleted(params) {
    const {app} = params;
    const file = app.workspace.activeLeaf.view.file.path;
    console.log(file);
    const {update, getPropertiesInFile} = app.plugins.plugins["metaedit"].api;
    const props = await getPropertiesInFile(file);
    const completedFieldExists = props.map(p => p.key).includes("completed");

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
    
    if (completedFieldExists) {
        await update("completed", "this is a test!", file);
    }
}