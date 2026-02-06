function hPrint(src)
{
	console.log("[Header/LOG] " + src)
}

var header = null

function makeHeaderButton(text, url)
{
	if (header == null)
		header = document.getElementById("header")

	hPrint("Making header button: " + text)
	var a = document.createElement("a")
	a.className = "headerBtn"
	a.href = url
	a.innerText = text

	header.appendChild(a)
}

console.log(
	"%c-[ Header Script Loaded ]-",
	"font-size: 24px; font-weight: bold; text-align: center; width: 100%; display: block;"
);
console.log(
	"%c> Version 1.0.0 <",
	"font-size: 18px; text-align: center; width: 100%; display: block;"
);