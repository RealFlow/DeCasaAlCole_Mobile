

var cartojs = function(localUrl, filter){

	var url = localUrl || 'http://decasaalcole.cartodb.com';
	
	// var sqlstr = 'with ftimes as (select cp_to cp, from_dist dist, from_time atime ' +
	// 	' from times where cp_from = \'{{cp}}\'), ttimes as (select ' +
	// 	'cp_from cp, to_dist dist, to_time atime from times where cp_to '+
	// 	'= \'{{cp}}\'), totaltimes as (select * from ftimes union '+
	// 	'select * from ttimes union select \'{{cp}}\' cp, 0 dist, 0 atime) '+
	// 	'select c.cartodb_id, c.cp, c.telefono, c.the_geom, ST_astext(c.the_geom) as tgeom, c.the_geom_webmercator, '+
	// 	'c.regimen, c.dgenerica, c.dabreviada, c.localidad, c.tipocalle, c.direccion, c.numero, c.codigo, '+
	// 	'((t.atime)/60)::integer minutes, (t.dist/1000)::integer kms from coles_cp2 c join totaltimes t on c.cp = t.cp {{&where}} order by t.atime, t.dist';

	var sqlstr = 'with ftimes as (select cp_to cp, from_dist dist, from_time atime ' +
		' from times where cp_from = \'{{cp}}\'), ttimes as (select ' +
		'cp_from cp, to_dist dist, to_time atime from times where cp_to '+
		'= \'{{cp}}\'), totaltimes as (select * from ftimes union '+
		'select * from ttimes union select \'{{cp}}\' cp, 0 dist, 0 atime) '+
		'select c.cp, c.telefono, '+
		'c.regimen, c.dgenerica, c.dabreviada, c.localidad, c.tipocalle, c.direccion, c.numero, c.codigo, '+
		'((t.atime)/60)::integer minutes, (t.dist/1000)::integer kms from coles_cp2 c join totaltimes t on c.cp = t.cp {{&where}} order by t.atime, t.dist';


	var result;
	var view = {
		cp: filter.cp,
		where: function(){
			var conditions = [];
			if (filter.regimen && filter.regimen !== '2' ){
				var reg = filter.regimen === '0' ? 'true' : 'false';
				conditions.push("regimen = " + reg);
			}
			if (filter.maxtime){
				conditions.push("atime < " + filter.maxtime);
			}
			if (filter.tipo){
				conditions.push("nived like '%"+filter.tipo+"%'");
			}

			if (conditions.length > 0)
				return "WHERE " + conditions.join(" AND ");
			else
				return '';

		}
	}

	if (filter && filter.cp){
		sqlstr = Mustache.render(sqlstr, view);
	}
	//http://decasaalcole.cartodb.com/api/v2/sql?q=
	var finalUrl = url + "/api/v2/sql?q=" + encodeURI(sqlstr);
	return finalUrl;
}
