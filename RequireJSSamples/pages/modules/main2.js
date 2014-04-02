requirejs.config({
    baseUrl: 'modules',
    paths: {
        lib: '../../lib' // relative to baseUrl
    }
});

// Start the main app logic.
requirejs(["lib/html", "lib/jquery-1.7.2.min", "test1"], function   () {
	$(".samplePanel").html(Test1(["Html", "jQuery", "Test1"]));
});