
export const assert = (betrue, ...msgs) => {

    if (betrue) {
		if (betrue.jquery && betrue.length===0) {
			// empty jquery selection - treat as false
			if ( ! msgs) msgs = ["empty jquery selection"];
			assertFailed(msgs);
			return;
		}
		// success
		return betrue;
	}
	assertFailed(msgs || betrue);

};

let assertFailed = function(msgs) {
	// we usually pass in an array from ...msg
	console.error("assert", ...msgs);
	// A nice string?
	let smsg = str(msgs);
	throw new Error("assert-failed: "+smsg);
};
