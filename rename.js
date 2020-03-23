fs = require('fs');
allocine = require('allocine-api')
function getExtension(filename)
{
	var re = /.(avi|mkv|mp4?)$/;
	if(re.test(filename) && re.exec(filename)[1].length >= 3) {
    	return re.exec(filename)[1];
    }else{
    	return 'avi';
    }
}   
fs.readdir(process.argv[2], function (err, files) {
	files.forEach(function(file){
		if(/\[([0-9]+)\]/.test(file)) {
			console.log(/\[([0-9]+)\]/.exec(file)[1]);
			allocine.api('movie', {code: /\[([0-9]+)\]/.exec(file)[1]}, function(error, result) {
				console.log(error);
			    if(!error && !result['error']) {
				    film = {
				    	code : result['movie']['code'],
				    	origin_title : result['movie']['originalTitle'],
				    	title : result['movie']['title'],
				    	year : result['movie']['productionYear'],
				    	casting : result['movie']['castingShort'],
				    	genre : result['movie']['genre']
				    }

				    old_path = process.argv[2] + '/' + file;
				    new_path = film.title;
				    if(film.originalTitle && film.title != film.originalTitle && film.originalTitle != '') {
				    	new_path += ' - ' + film.originalTitle;
				    }
				    new_path += ' - ' + film.year;
				    genres = '';
				    film.genre.forEach(function(genre) {
				    	if(genre && genre['$']) {
					    	genres += genre['$'] + ' ';
					    }
				    });
				    if(genres) {
				    	new_path += ' ( ' + genres + ')';
				    }
				    if(film.casting) {
				    	for(var value in film.casting) {
				    		if(value && film.casting[value]) {
				    			new_path += ' -';
				    			persons = film.casting[value].split(',');
				    			max = 3;
				    			if(persons.length < max) {
				    				max = persons.length;	
				    			}
				    			for(z=0;z<max;z++) {
				    				new_path += ' ' + persons[z].trim();
				    			}
				    			
				    		}
				    	}
				    }
				    new_path += ' ['+film.code+']';
				    stripcarac = '<>:"/\\|?*';
				    new_path_clean = ''
				    for(i=0; i<new_path.length; i++){
				    	noprob = true;
				    	for(y=0; y<stripcarac.length; y++){
				    		if(new_path[i] == stripcarac[y]){
				    			//console.log(new_path[i] + stripcarac[y]);
				    			noprob = false;	
				    		}
				    	}
				    	if(noprob) {
				    		new_path_clean += new_path[i];
				    	}
				    }
				    ext = getExtension(old_path);
				    new_path = process.argv[2] + '/' + new_path_clean + '.' + ext;
				    console.log(new_path)
				    fs.rename(old_path,new_path,function (err) {
				    	console.log(err)
				    });
				}
			});
		}
	});
});

	
