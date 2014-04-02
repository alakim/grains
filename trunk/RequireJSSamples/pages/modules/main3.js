requirejs.config({
    baseUrl: 'modules',
    paths: {
        lib: '../../lib' // relative to baseUrl
    }
});

// Start the main app logic.
requirejs(["lib/html", "lib/jquery-1.7.2.min", "test2", "test3"], function   () {
	//$(".samplePanel").html("SUCCESS");
});