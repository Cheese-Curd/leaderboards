/* SUPABASE API URL/PUBLIC KEY */
const SUPABASE_URL      = "https://auzlaekgsxpgyzyumrix.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8mPxMb0aEr51tf_CWMPBIw_hp0Go8Ru";

const params = new URLSearchParams(window.location.search);

supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
user = null

webTitle = document.getElementById("webTitle")

function titleCase(str)
{
	return str
		.replace(/[_-]/g, " ")
		.toLowerCase()
		.replace(/\b\w/g, c => c.toUpperCase());
}

function formatDate(str)
{
	const [year, month, day] = str.split("-");

	// I'll just use this for whenever the date is unknown (Times before the leaderboard was on this site)
	if (year == "0001" && month == "01" && day == "01")
		return "Unknown"

	return `${month}/${day}/${year}`;
}

var displayNames = {}
var validGames   = {}
var newsData     = {}

function getDisplayNameFromUUID(uuid)
{
	if (uuid == null)
		return "Deleted User"

	return displayNames[uuid]
}

console.log(
	"%c-[ Utility Script Loaded ]-",
	"font-size: 24px; font-weight: bold; text-align: center; width: 100%; display: block;"
);
console.log(
	"%c> Version 1.0.0 <",
	"font-size: 18px; text-align: center; width: 100%; display: block;"
);

function uPrint(str)
{
	console.log("[Util/LOG] " + str)
}

async function getDisplayNames()
{
	const { data, error } = await supabaseClient
		.from("user_data")
		.select("*")
	
	if (error)
		throw new Error("Failed to gather user data!")

	var list = {}

	data.forEach(user => {
		list[user.id] = user.display_name
	})

	uPrint("Got users")

	return list
}

function addLoading()
{
	// <div class="subtitle" id="loadingTxt">Loading...</div>

	var loading = document.createElement("div")
	loading.className = "subtitle"
	loading.id = "loadingTxt"
	loading.innerText = "Loading..."

	document.body.appendChild(loading)
	
	return loading
}

function addFooterAndHeader()
{
	var footer = document.createElement("footer")
	var copyright = document.createElement("div")
	copyright.id = "copyright"
	var cprTxt = document.createElement("span")
	cprTxt.innerText = "[Apache 2.0] Copyright © 2026 cheese-curd.github.io - All Rights Reserved. "
	var license = document.createElement("a")
	license.innerText = "[ License ]"
	license.href = "./LICENSE.md"

	footer.appendChild(copyright)
	copyright.appendChild(cprTxt)
	copyright.appendChild(license)

	var header = document.createElement("header")
	header.id = "header"

	document.body.appendChild(header)
	document.body.appendChild(footer)
}

function getURLString(uCategory, url)
{
	console.log(uCategory, url)
	var urlStr = ""
	if (url.startsWith("http"))
		urlStr = url
	else
		urlStr = "./Images/" + uCategory + "/" + banner

	return urlStr
}

function getBannerString(banner)
{
	return getURLString("Banner", banner)
}

function getIconString(icon)
{
	return getURLString("Icon", icon)
}

function err(err, title, desc, code)
{
	webTitle.innerText = "Leaderboards - ERROR"

	titleText.innerText = `! ERROR !\n(${code})`
	
	document.getElementById("content").childNodes.forEach(child => {
		if (child.className == "headerTitle" || child.className == "error")
			return

		child.style.display = "none"
	})

	errorDiv.style.display = "block"

	errorTitle.innerText = title
	errorDesc.innerText = desc

	loadingTxt.style.opacity = 0
	document.getElementById("content").className = "fadeOutBlur"

	if (err != null)
		throw new Error(err)
}

async function getNewsData()
{
	const { data, error } = await supabaseClient
		.from("news")
		.select("*")

	if (error)
		err(error, `Failed to get news data.`, "Error: " + error.message, error.code + " [L37]")
	else
		return data
}

var timezoneOffset = new Date().getTimezoneOffset();

// ChatGPT did this
// Make timestamp ISO-compliant so JS parses it correctly
function normalizeTimestamp(ts) {
    // Replace space with T and ensure +00:00 format
    if (!ts.includes("T")) ts = ts.replace(" ", "T");
    if (ts.endsWith("+00")) ts += ":00";
    return ts;
}

// Convert timestamp to a table of Date / Time / Time-24hour
function timestampToTable(timestamp) {
    const date = new Date(normalizeTimestamp(timestamp));

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const hours24 = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    let hours12 = date.getHours();
    const ampm = hours12 >= 12 ? "PM" : "AM";
    hours12 = hours12 % 12 || 12;

    return {
        Date: formatDate(`${yyyy}-${mm}-${dd}`),
        Time: `${hours12}:${minutes} ${ampm}`,
        "Time-24hour": `${hours24}:${minutes}`,
    };
}
// No longer ChatGPT

async function init()
{
	var loadingTxt = addLoading()
	loadingTxt.innerText = "Handling Header/Footer..."

	addFooterAndHeader()
	makeHeaderButton("Home", "./")
	initNews()

	loadingTxt.innerText = "Getting User Data..."
	user         = await supabaseClient.auth.getUser();
	displayNames = await getDisplayNames()

	loadingTxt.innerText = "Getting Game Data..."
	const { data, error } = await supabaseClient
		.from("games")
		.select("*")

	if (error)
		throw new Error(error.message)

	data.forEach(game => {
		validGames[game.gameID] = {
			gameName: game.gameName,
			banner: game.banner,
			icon: game.icon,
			categories: game.categories
		};
	})

	loadingTxt.innerText = "Getting News Posts..."
	newsData = await getNewsData()
	newsData.forEach(post => {
		addNews(post)
	})
	
	loadingTxt.innerText = "Finishing up..."
}