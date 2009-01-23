$stdout = File.open("TagDefinitions.cs", "w+")

tags = ['DIV', 'P', 'SPAN', 'A', 'PRE', 'UL', 'OL', 'LI', 'INPUT', 'TEXTAREA', 'TABLE', 'TR', 'TH', 'TD', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
attributes = ['class', 'width', 'height', 'border', 'cellpadding', 'cellspacing', 'align', 'valign', 'style', 'src', 'href', 'id', 'name', 'type', 'title']

puts <<END_OF_CS
// ******************** ВНИМАНИЕ! **************************
// *                                                       *
// *        ЭТОТ ФАЙЛ СФОРМИРОВАН АВТОМАТИЧЕСКИ            *
// *                 НЕ ИЗМЕНЯЙТЕ ЕГО                      *
// *                                                       *
// *           все необходимые изменения следует           *
// *         производить через файл кодогенератора         *
// *               BuildTagDefinitions.rb                  *
// *                                                       *
// *********************************************************
using System;
using System.Collections.Generic;
using System.Text;

namespace IVC.Markup {
	public static partial class Html {
END_OF_CS

tags.each do|name|
	puts <<-END_OF_TAG
		
		/// <summary>Формирует тег #{name}</summary>
		/// <param name="content">контент</param>
		public static string #{name.capitalize}(params object[] content) {
			return Tag("#{name.downcase}", content);
		}

		/// <summary>Формирует тег #{name}</summary>
		/// <param name="content">контент</param>
		public static string #{name.capitalize}(object content) {
			return #{name.capitalize}(new object[] { content });
		}
	END_OF_TAG
end

attributes.each do|name|
	puts <<-END_OF_ATTR

		/// <summary>Формирует описание атрибута #{name}</summary>
		/// <param name="val">значение атрибута</param>
		public static string A_#{name}(object val) {
			return Attribute("#{name}", val);
		}
	END_OF_ATTR
end

puts '	}'

puts <<END_OF_CS
	
	public abstract partial class Template {
END_OF_CS

tags.each do|name|
	puts <<-END_OF_TAG

		/// <summary>Формирует тег #{name}</summary>
		/// <param name="content">контент</param>
		protected static string #{name.capitalize}(object content) {
			return Html.#{name.capitalize}(content);
		}

		/// <summary>Формирует тег #{name}</summary>
		/// <param name="content">контент</param>
		protected static string #{name.capitalize}(params object[] content) {
			return Html.#{name.capitalize}(content);
		}
	END_OF_TAG
end

puts <<END_OF_METHOD

		/// <summary>Формирует описание атрибута</summary>
		/// <param name="name">имя атрибута</param>
		/// <param name="val">значение атрибута</param>
		public static string Attribute(string name, object val) {
			return Html.Attribute(name, val);
		}
END_OF_METHOD

attributes.each do|name|
	puts <<-END_OF_ATTR

		/// <summary>Формирует описание атрибута #{name}</summary>
		/// <param name="val">значение атрибута</param>
		protected static string A_#{name}(object val) {
			return Html.A_#{name}(val);
		}
	END_OF_ATTR
end

puts '	}'

puts '}'

$stdout.close
