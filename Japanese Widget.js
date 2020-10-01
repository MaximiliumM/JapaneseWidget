// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: magic;
// The script picks a random word from
// a previously exported List from the
// dictionary app called Japanese
// -------

let items = await loadItems()
let widget = await createWidget(items)
// Check if the script is running in
// a widget. If not, show a preview of
// the widget to easier debug it.

if (!config.runsInWidget) {
	await widget.presentMedium()
}

// Tell the system to show the widget.
Script.setWidget(widget)
Script.complete()	


async function createWidget(items) {
	let word = items[0]
	let reading = items[1]
	let meaning = items[2]
	
	// Determine size factor
	let sizeFactor = config.widgetFamily == "large" ? 2 : 1
		
	// Calculate font size for given word
	let fontSize = (24 - word.length) - Math.round((word.length / 4))
	
	let gradient = new LinearGradient()
	gradient.locations = [0, 0.8]
	gradient.colors = [
		new Color("#CF2C26", 1),
		new Color("#B12420", 0)
	]
	
	let w = new ListWidget()
	
	// Get background image based on widget size
	let fm = FileManager.iCloud()
	let dir = fm.documentsDirectory() + "/Japanese Widget/"
	let path = fm.joinPath(dir, "bg-" + config.widgetFamily + ".png")
	let img = Image.fromFile(path)
	
	// Define URL 
	let url = encodeURI('japanese://entry/' + word)
	w.url = url
	
	// Change default padding
	w.setPadding(16, 16, 16, 20)
	// Add logo as background image
	w.backgroundImage = img
	w.backgroundColor = new Color("#B12420")
	w.backgroundGradient = gradient
	// Add spacer above content to center it vertically.
	w.addSpacer()
	// Show word as heading
	let titleTxt = w.addText(word)
	titleTxt.font = Font.boldSystemFont(fontSize * sizeFactor)
	titleTxt.textColor = Color.white()
	// Show reading
	let subTxt = w.addText(reading)
	subTxt.font = Font.heavySystemFont(9 * sizeFactor)
	subTxt.textColor = Color.white()
	subTxt.textOpacity = 0.9
	// Add spacing below reading
	w.addSpacer(8)
	// Show meaning	
	let bodyTxt = w.addText(meaning)
	bodyTxt.font = Font.mediumSystemFont(12)
	bodyTxt.textColor = Color.white()
	bodyTxt.textOpacity = 0.9
	// Add spacing below subtext
	w.addSpacer(2)
	// Add spacing below content to center it vertically.
	w.addSpacer()	
	return w
}
  
async function loadItems() {	
	let fm = FileManager.iCloud()
	let dir = fm.documentsDirectory() + "/Japanese Widget/"
	let path = fm.joinPath(dir, "Japanese Words List.txt")
	
	let text = fm.readString(path)
	let list = text.split('\n')
	
	var newList = []
	
	for (element of list)
	{
		if (element.length > 0 && element != 'Created with Japanese for iOS®') {
			newList.push(element)
		}
	}
	
	const randomIndex = Math.floor(Math.random() * newList.length);
	
	var word = ''
	var reading = ''
	var meaning = ''
	
	// Being an even number means it fetches the meaning first
	if (randomIndex % 2 == 0) {
		word = newList[randomIndex].split('（')
		word[1] != null ? reading = word[1].replace('）','') : reading = ''
		word = word[0]
		meaning = newList[randomIndex + 1]
	
	} else {
		word = newList[randomIndex - 1].split('（')
		word[1] != null ? reading = word[1].replace('）','') : reading = ''
		word = word[0]
		meaning = newList[randomIndex]
	}

	return [word, reading, meaning]
}