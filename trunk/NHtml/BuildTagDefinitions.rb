$stdout = File.open("TagDefinitions.cs", "w+")

tags = ['DIV', 'P', 'SPAN', 'A', 'PRE', 'UL', 'OL', 'LI', 'INPUT', 'TEXTAREA', 'TABLE', 'TR', 'TH', 'TD', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
attributes = ['class', 'width', 'height', 'border', 'cellpadding', 'cellspacing', 'align', 'valign', 'style', 'src', 'href', 'id', 'name', 'type', 'title']

puts <<END_OF_CS
// ******************** ��������! **************************
// *                                                       *
// *        ���� ���� ����������� �������������            *
// *                 �� ��������� ���                      *
// *                                                       *
// *           ��� ����������� ��������� �������           *
// *         ����������� ����� ���� ��������������         *
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
		
		/// <summary>��������� ��� #{name}</summary>
		/// <param name="content">�������</param>
		public static string #{name.capitalize}(params object[] content) {
			return Tag("#{name.downcase}", content);
		}

		/// <summary>��������� ��� #{name}</summary>
		/// <param name="content">�������</param>
		public static string #{name.capitalize}(object content) {
			return #{name.capitalize}(new object[] { content });
		}
	END_OF_TAG
end

attributes.each do|name|
	puts <<-END_OF_ATTR

		/// <summary>��������� �������� �������� #{name}</summary>
		/// <param name="val">�������� ��������</param>
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

		/// <summary>��������� ��� #{name}</summary>
		/// <param name="content">�������</param>
		protected static string #{name.capitalize}(object content) {
			return Html.#{name.capitalize}(content);
		}

		/// <summary>��������� ��� #{name}</summary>
		/// <param name="content">�������</param>
		protected static string #{name.capitalize}(params object[] content) {
			return Html.#{name.capitalize}(content);
		}
	END_OF_TAG
end

puts <<END_OF_METHOD

		/// <summary>��������� �������� ��������</summary>
		/// <param name="name">��� ��������</param>
		/// <param name="val">�������� ��������</param>
		public static string Attribute(string name, object val) {
			return Html.Attribute(name, val);
		}
END_OF_METHOD

attributes.each do|name|
	puts <<-END_OF_ATTR

		/// <summary>��������� �������� �������� #{name}</summary>
		/// <param name="val">�������� ��������</param>
		protected static string A_#{name}(object val) {
			return Html.A_#{name}(val);
		}
	END_OF_ATTR
end

puts '	}'

puts '}'

$stdout.close
