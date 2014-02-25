/*!
 * VERSION: 0.1
 * DATE: 2014-02-21
 * 
 * coveraxis: Lets you use "cover" with a dynamic axis point
 * 
 * Todos:
 * - setCoverAxis: Set the axis exactly where you click on the image, not the container
 * 
 * Ideas:
 * - setCoverAxis: Make as a plugin on its own
 * - Add an axis to force the image axis to be positioned there
 * 
 * @author: Martin Lindström
 */
(function($) {
	"use strict";
		
	var _regexp_background_url = /^url\("?(.+?)"?\)$/,
		_defaults = {
			axis: {
				x: .5,
				y: .5
			},
			beforeSetAxis: function() {},
			afterSetAxis: function() {}
		},
		_settings,
		_init = true,
		_updateCoverAxis = function (element, image) {
			var new_background_width,
				new_background_position_x,
				new_background_position_y,
				container_size = {
					width: element.width(),
					height: element.height()
				},
				container_ratio = container_size.width / container_size.height,
				image_ratio = image.width / image.height,
				diff_x,
				diff_y;
			
			if (!image.width)
				console.log(image);
			
			//Calculate size and position
			if (image_ratio > container_ratio) {
				
				diff_x = Math.round((container_size.height * image_ratio - container_size.width) * element.attr('data-axis-x'));
				
				new_background_width = container_size.height * image_ratio;
				new_background_position_x = -diff_x;
				new_background_position_y = 0;
				
			}
			else {
				
				diff_y = Math.round((container_size.width / image_ratio - container_size.height) * element.attr('data-axis-y'));
				
				new_background_width = container_size.width;
				new_background_position_x = 0;
				new_background_position_y = -diff_y;
				
			}
			
			//Set position and size of background image
			element.css({
				'background-size': new_background_width + 'px ',
				'background-position-x': new_background_position_x + 'px',
				'background-position-y': new_background_position_y + 'px'
			});
		};
	
	$.fn.coverAxis = function (options) {
		
		_settings = $.extend({}, _defaults, options);
		
		var _this = this;
		
		if (_init) {
			$(window).resize(function () {	
				$(_this).coverAxis(_settings);
			});
			
			_init = false;
		}
		
		this.each(function() {
			
			var element = $(this),
				image_url = element.css('background-image'),
				image,
				container_size = {
					width: element.width(),
					height: element.height()
				},
				data_axis_x = parseFloat(element.attr('data-axis-x')),
				data_axis_y = parseFloat(element.attr('data-axis-y'));
			
			//Set data-axis-attributes
			element.attr('data-axis-x', ((isNaN(data_axis_x) || data_axis_x > 1 || data_axis_x < 0) ? _settings.axis.x : data_axis_x));
			element.attr('data-axis-y', ((isNaN(data_axis_y) || data_axis_y > 1 || data_axis_y < 0) ? _settings.axis.y : data_axis_y));
			
			image_url = image_url.match(_regexp_background_url);
			
			if (image_url[1]) {
				
				image_url = image_url[1];
				
				image = new Image();
				image.src = image_url;
				
				// make sure the image is loaded
				$(image).load(_updateCoverAxis(element, image));
			}
		
		});
		
	}
	
	$.fn.setCoverAxis = function (e) {
		
		//Fire callback
		_settings.beforeSetAxis.call(this);
		
		var element = $(this),
			offset = element.offset(),
		    x = e.pageX - offset.left,
			y = e.pageY - offset.top,
			image_url = element.css('background-image'),
			image;
		
		image_url = image_url.match(_regexp_background_url);
		
		if (image_url[1]) {
			
			image_url = image_url[1];
			
			image = new Image();
			image.src = image_url;
			
			element.attr('data-axis-x', (x / element.width()));
			element.attr('data-axis-y', (y / element.height()));
			
			// make sure the image is loaded
			$(image).load(_updateCoverAxis(element, image));
		}
		
		//Fire callback
		_settings.afterSetAxis.call(this);
	}
	
}(jQuery));

