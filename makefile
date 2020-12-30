main:
	devops  from=dev to=release/v0.29.0 msg='refactor: popup-select'
deno-adapter:
	# not work
	#deno run --allow-run --allow-net  deno-adapter.ts
	deno run -A  deno-adapter.ts
deno:
	# unavailable
	deno run --unstable --allow-read=node_modules deno.ts
test_chrome:
	/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --headless --remote-debugging-port=9222 --crash-dumps-dir=/tmp https://www.baidu.com

