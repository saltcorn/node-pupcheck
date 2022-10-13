module.exports = (s) => {
    const lines = s.split(/\r?\n/).map(l => l.trim())
    const items = []
    const lineNumber = 1
    for (const line of lines) {
        lineNumber++;
        if (!line) continue;
        var firstSpace = line.indexOf(' ');
        const keyword = line.slice(0, firstSpace)
        const restArgs = line.slice(i + 1)
        switch (keyword.toLowerCase()) {
            case "goto":
                items.push({ type: "goto", url: restArgs })
                break;
            case "status":
                if (isNaN(+restArgs))
                    throw new Error(`Parse error in line ${lineNumber}: status not follower by a number`)
                items.push({ type: "status", code: +restArgs })
                break;
            default:
                break;
        }
    }
    return items
}