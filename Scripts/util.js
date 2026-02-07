/* SUPABASE API URL/PUBLIC KEY */
const SUPABASE_URL      = "https://auzlaekgsxpgyzyumrix.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8mPxMb0aEr51tf_CWMPBIw_hp0Go8Ru";

supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
user = null

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

function getDisplayNameFromUUID(uuid)
{
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

function getBannerString(banner)
{
	var bannerStr = ""
	if (banner.startsWith("http"))
		bannerStr = banner
	else
		bannerStr = "./Images/Banners/" + banner

	return bannerStr
}

async function init()
{
	addFooterAndHeader()
	makeHeaderButton("Home", "./")
	var loadingTxt = addLoading()

	loadingTxt.innerText = "Getting User Data..."
	user         = await supabaseClient.auth.getUser();
	displayNames = await getDisplayNames()

	loadingTxt.innerText = "Getting Game Data..."
	const { data, error } = await supabaseClient
		.from("games")
		.select("gameID,gameName,banner,categories")

	if (error)
		throw new Error(error.message)

	data.forEach(game => {
		validGames[game.gameID] = {
			gameName: game.gameName,
			banner: game.banner,
			categories: game.categories
		};
	})
	uPrint("Fetched Games")
	
	loadingTxt.innerText = "Finishing up..."
}