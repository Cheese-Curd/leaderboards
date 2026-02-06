const leaderboardDiv = document.getElementById("leaderboard")
const loadingTxt     = document.getElementById("loadingTxt")
const errorDiv       = document.getElementById("error")
const titleText      = document.getElementById("headerTitle")

const errorTitle = document.getElementById("errorTitle")
const errorDesc  = document.getElementById("errorDesc")

const gameName     = document.getElementById("game")
const bannerDiv    = document.getElementById("bannerImage")
const categoryName = document.getElementById("category")

const leaderboardTable = document.querySelector(".lbList");

const webTitle = document.getElementById("webTitle")

function print(str)
{
	console.log("[Leadboard Handler/LOG] " + str)
}

function warn(str)
{
	console.warn("[Leaderboard Handler/WARN] " + str)
}

function err(err, title, desc, code)
{
	webTitle.innerText = "Leaderboards - ERROR"

	warn("An error has occured!")

	titleText.innerText = `! ERROR !\n(${code})`
	loadingTxt.style.display = "none"
	leaderboardDiv.style.display = "none"
	errorDiv.style.display = "block"

	errorTitle.innerText = title
	errorDesc.innerText = desc

	if (err != null)
		throw new Error(err)
}

async function isValidGame(gameName)
{
	print("Searching for game '" + gameName + "'...")

	var valid   = false
	var engName = "" 
	var banner  = ""

	const { data, error } = await supabaseClient
		.from("games")
		.select("gameID,gameName,banner") // Only need the ID and name

	if (error)
	{
		err(error, "Failed to fetch games.", "Error: " + error.name, error.code)
		return false
	}
	else
	{
		if (data == null)
			return err(null, "Failed to fetch games.", "Error: 'data' in null/undefined", "500 [L89]"), false
		
		data.forEach(game => {
			if (game.gameID == gameName)
			{
				print("Found game! (" + game.gameName + ")")
				valid   = true
				engName = game.gameName
				banner  = game.banner
			}
		})
	}

	if (!valid)
		err(null, `Failed to find game "${gameName}".`, `Error: Unable to find the game "${gameName}", are you sure we host this on this site?`, "404")
	return { valid, engName, banner }
}

async function getGameData(gameName, selCategory)
{
	if (selCategory == null)
		selCategory = "any"
	selCategory = selCategory.replace("%", "") // You can't have % in the table name without it breaking

	const { data, error } = await supabaseClient
		.schema(gameName)
		.from(selCategory)
		.select("*")

	if (error)
	{
		err(error, `Failed to get game data for ${gameName}.`, "Error: " + error.message, error.code + " [L122]")
		if (selCategory != "any") // fall back for if the site couldn't find the category
			window.location.href = "/leaderboard.html?game=" + gameName + "&category=any%"
	}
	else
	{
		errorDiv.style.display = "none"

		print("Got data!")
		return data
	}
}

async function handleLeaderboard(visible)
{
	leaderboardDiv.style.display = "none"

	if (visible)
	{
		loadingTxt.style.display = "block"
		
		var { valid, engName, banner } = await isValidGame(game.toLowerCase())
		if (valid)
		{
			webTitle.innerText = "Leaderboards - Loading..."

			if (category == null)
				category = "Any%"

			const lboard = await getGameData(game.toLowerCase(), category.toLowerCase())
			if (lboard == null)
				return err(null, `Failed to get game data for ${game}.`, `Error: 'data' is null/undefined`, "500 [L154]")

			webTitle.innerText = "Leaderboards - " + engName

			print("Setting up leaderboard...")
			gameName.innerText = engName
			categoryName.innerText = titleCase(category)

			if (lboard.length == 0)
			{
				warn("No runs found.")
				// Quick message telling you that there are no runs found
				const tr = document.createElement("tr");
				tr.innerHTML = `
				<td colspan="6" style="text-align:center; font-style:italic;">
					No runs yet...
					Maybe you can!
				</td>
				`;
				leaderboardTable.appendChild(tr);
			}
			else
			{
				print(`Found ${lboard.length} run(s)`)
				lboard.forEach(entry => {
					print(`${entry.Rank} -> ${entry.Runner}`)
					const tr = document.createElement("tr");

					tr.innerHTML = `
					<td class="rank">${entry.Rank}</td>
						<td class="runner">${getDisplayNameFromUUID(entry.Runner)}</td>
						<td>${entry.RTA}</td>
						<td>${entry.ReTimed}</td>
						<td>${formatDate(entry.Date)}</td>
					<td>${entry.Verified ? "Yes" : "No"}</td>
					`;

					leaderboardTable.appendChild(tr);
				})
			}

			print(banner)
			bannerDiv.style.backgroundImage = `url('Images/Banners/${banner}')`

			// Hide loading text, and show the leaderboard which (hopefully) should have times
			loadingTxt.style.display = "none"
			leaderboardDiv.style.display = "block"
			errorDiv.style.display = "none"
			titleText.innerText = "Leaderboard"
		}
	}

	return true
}

console.log(
	"%c-[ Leaderboard Handler Loaded ]-",
	"font-size: 24px; font-weight: bold; text-align: center; width: 100%; display: block;"
);
console.log(
	"%c> Version 1.1.2 <",
	"font-size: 18px; text-align: center; width: 100%; display: block;"
);

const params   = new URLSearchParams(window.location.search);
var game     = params.get("game")
var category = params.get("category")

handleLeaderboard(game != null)