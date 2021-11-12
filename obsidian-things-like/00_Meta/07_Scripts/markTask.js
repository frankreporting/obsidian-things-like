class MarkTask {
    
    async complete(args) {
        const {
            app,
            file,
            moment
        } = args;

        const format = (date) => date.format("YYYY-MM-DD");
        const today = moment();
        const {update, getPropertiesInFile} = app.plugins.plugins["metaedit"].api;
        const props = await getPropertiesInFile(file);
        const completedFieldExists = props.map(p => p.key).includes("completed");
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
                let dateFrom = lastRepeatFieldExists ? lastRepeat : (start ? start : null);
                if (dateFrom) {
                    switch (repeat) {
                        case "daily":
                            date = today.add(1, 'days');
                            break;
                        case "weekly":
                            date = updateStart(moment(dateFrom).add(1, 'weeks'), 1, 'weeks');
                            break;
                        case "biweekly":
                            date = updateStart(moment(dateFrom).add(2, 'weeks'), 2, 'weeks');
                            break;
                        case "monthly":
                            date = updateStart(moment(dateFrom).add(1, 'months'), 1, 'months');
                            break;
                        case "bimonthly":
                            date = updateStart(moment(dateFrom).add(2, 'months'), 2, 'months');
                            break;
                        case "quarterly":
                            date = updateStart(moment(dateFrom).add(1, 'quarters'), 1, 'quarters');
                            break;
                        case "annually":
                            date = updateStart(moment(dateFrom).add(1, 'years'), 1, 'years');
                            break;
                        default:
                            break;
                    }
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
                if (lastRepeatFieldExists) {
                    await update("lastRepeat", format(newStart), file);
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
}