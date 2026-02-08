const leaderboardDiv = document.getElementById("leaderboard")
const errorDiv       = document.getElementById("error")
const titleText      = document.getElementById("headerTitle")

const errorTitle = document.getElementById("errorTitle")
const errorDesc  = document.getElementById("errorDesc")

const gameName     = document.getElementById("game")
const bannerDiv    = document.getElementById("bannerImage")
const categoryList = document.getElementById("category")

const leaderboardTable = document.querySelector(".lbList");

function print(str)
{
	console.log("[Leadboard Handler/LOG] " + str)
}

function warn(str)
{
	console.warn("[Leaderboard Handler/WARN] " + str)
}

async function isValidGame(gameName)
{
	print("Searching for game '" + gameName + "'...")

	var valid      = false
	var engName    = ""
	var banner     = ""
	var categories = []

	if (validGames == null)
		return err(null, "Failed to fetch games.", "Error: 'data' in null/undefined", "500 [L89]"), false

	for (const [gameID, game] of Object.entries(validGames))
	{
		if (gameID == gameName)
		{
			print("Found game! (" + game.gameName + ")")
			valid      = true
			engName    = game.gameName
			banner     = game.banner
			categories = game.categories
			break
		}
	}

	if (!valid)
		err(null, `Failed to find game "${gameName}".`, `Error: Unable to find the game "${gameName}", are you sure we host this on this site?`, "404")
	return { valid, engName, banner, categories }
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
			window.location.href = "./leaderboard.html?game=" + gameName + "&category=any%"
	}
	else
	{
		errorDiv.style.display = "none"

		print("Got data!")
		return data.sort((a, b) => a.Rank - b.Rank);
	}
}

async function handleLeaderboard(game, category, visible)
{
	leaderboardDiv.style.display = "none"

	if (visible)
	{
		var { valid, engName, banner, categories } = await isValidGame(game.toLowerCase())
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

			loadingTxt.innerText = "Gathering Categories..."
			categories.forEach(vCategory => {
				var categoryOption = document.createElement("option")
				categoryOption.value = vCategory
				categoryOption.innerText = titleCase(vCategory)
				categoryList.appendChild(categoryOption)
			})

			categoryList.value = category

			categoryList.addEventListener("change", () => {
				window.location.href = "./leaderboard?game=" + game + "&category=" + categoryList.value
			});

			loadingTxt.innerText = "Adding Runs..."
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
					var runnerDName = getDisplayNameFromUUID(entry.Runner)
					print(`${entry.Rank} -> ${runnerDName}`)
					const tr = document.createElement("tr");

					tr.innerHTML = `
					<td class="rank">${entry.Rank}</td>
						<td class="runner">${runnerDName}</td>
						<td title="${entry.Special ? entry.SpecialReason : ""}" class="${entry.Special ? "special" : ""}">${entry.RTA}</td>
						<td>${entry.ReTimed}</td>
						<td>${formatDate(entry.Date)}</td>
					<td>${entry.Verified ? "Yes" : "No"}</td>
					`;

					leaderboardTable.appendChild(tr);
				})
			}

			print(banner)
			var bannerStr = getBannerString(banner)
			bannerDiv.style.backgroundImage = `url('${bannerStr}')`

			// Show the leaderboard which (hopefully) should have times
			leaderboardDiv.style.display = "block"
			errorDiv.style.display = "none"
			titleText.innerText = "Leaderboard"

			loadingTxt.innerText = "Done!"
			loadingTxt.style.opacity = 0
			document.getElementById("content").className = "fadeOutBlur"
		}
	}
	else
		window.location.href = "./" // Go back to the main page as there is no game requested

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