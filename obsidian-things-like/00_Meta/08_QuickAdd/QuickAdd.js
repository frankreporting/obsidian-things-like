module.exports = async function addNew(params) {
    const {app, quickAddApi: {suggester, inputPrompt, yesNoPrompt}} = params;
    const newFile = await inputPrompt("","Quick add...");
    params.variables["template"] = "00_Meta/01_Templates/Task.md";
    const folders = app.vault.getAllLoadedFiles().filter(f => f.children).map(f => f.path);
    const targetFolder = await suggester(folders, folders);
    if (!targetFolder) return;
    params.variables["selectedFolder"] = targetFolder;

    // const shouldMoveNested = await yesNoPrompt("Should I move nested tags, too?", `If you say no, I'll only move tags that are strictly equal to what you've chosen. If you say yes, I'll move tags that are nested under ${tag}.`);

    // for (const file of filesToMove) {
    //     const tfile = app.vault.getAbstractFileByPath(file);
    //     await app.fileManager.renameFile(tfile, `${targetFolder}/${tfile.name}`);
    // }
    
    
}