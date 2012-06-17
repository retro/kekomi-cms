steal("funcunit/qunit", "admin/fixtures", "admin/models/page.js", function(){
	module("Model: Admin.Models.Page")
	
	test("findAll", function(){
		expect(4);
		stop();
		Admin.Models.Page.findAll({}, function(pages){
			ok(pages)
	        ok(pages.length)
	        ok(pages[0].name)
	        ok(pages[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Admin.Models.Page({name: "dry cleaning", description: "take to street corner"}).save(function(page){
			ok(page);
	        ok(page.id);
	        equals(page.name,"dry cleaning")
	        page.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Admin.Models.Page({name: "cook dinner", description: "chicken"}).
	            save(function(page){
	            	equals(page.description,"chicken");
	        		page.update({description: "steak"},function(page){
	        			equals(page.description,"steak");
	        			page.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Admin.Models.Page({name: "mow grass", description: "use riding mower"}).
	            destroy(function(page){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})