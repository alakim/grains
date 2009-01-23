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
		
		/// <summary>��������� ��� DIV</summary>
		/// <param name="content">�������</param>
		public static string Div(params object[] content) {
			return Tag("div", content);
		}

		/// <summary>��������� ��� DIV</summary>
		/// <param name="content">�������</param>
		public static string Div(object content) {
			return Div(new object[] { content });
		}
		
		/// <summary>��������� ��� P</summary>
		/// <param name="content">�������</param>
		public static string P(params object[] content) {
			return Tag("p", content);
		}

		/// <summary>��������� ��� P</summary>
		/// <param name="content">�������</param>
		public static string P(object content) {
			return P(new object[] { content });
		}
		
		/// <summary>��������� ��� SPAN</summary>
		/// <param name="content">�������</param>
		public static string Span(params object[] content) {
			return Tag("span", content);
		}

		/// <summary>��������� ��� SPAN</summary>
		/// <param name="content">�������</param>
		public static string Span(object content) {
			return Span(new object[] { content });
		}
		
		/// <summary>��������� ��� PRE</summary>
		/// <param name="content">�������</param>
		public static string Pre(params object[] content) {
			return Tag("pre", content);
		}

		/// <summary>��������� ��� PRE</summary>
		/// <param name="content">�������</param>
		public static string Pre(object content) {
			return Pre(new object[] { content });
		}
		
		/// <summary>��������� ��� UL</summary>
		/// <param name="content">�������</param>
		public static string Ul(params object[] content) {
			return Tag("ul", content);
		}

		/// <summary>��������� ��� UL</summary>
		/// <param name="content">�������</param>
		public static string Ul(object content) {
			return Ul(new object[] { content });
		}
		
		/// <summary>��������� ��� OL</summary>
		/// <param name="content">�������</param>
		public static string Ol(params object[] content) {
			return Tag("ol", content);
		}

		/// <summary>��������� ��� OL</summary>
		/// <param name="content">�������</param>
		public static string Ol(object content) {
			return Ol(new object[] { content });
		}
		
		/// <summary>��������� ��� LI</summary>
		/// <param name="content">�������</param>
		public static string Li(params object[] content) {
			return Tag("li", content);
		}

		/// <summary>��������� ��� LI</summary>
		/// <param name="content">�������</param>
		public static string Li(object content) {
			return Li(new object[] { content });
		}
		
		/// <summary>��������� ��� INPUT</summary>
		/// <param name="content">�������</param>
		public static string Input(params object[] content) {
			return Tag("input", content);
		}

		/// <summary>��������� ��� INPUT</summary>
		/// <param name="content">�������</param>
		public static string Input(object content) {
			return Input(new object[] { content });
		}
		
		/// <summary>��������� ��� TEXTAREA</summary>
		/// <param name="content">�������</param>
		public static string Textarea(params object[] content) {
			return Tag("textarea", content);
		}

		/// <summary>��������� ��� TEXTAREA</summary>
		/// <param name="content">�������</param>
		public static string Textarea(object content) {
			return Textarea(new object[] { content });
		}
		
		/// <summary>��������� ��� TABLE</summary>
		/// <param name="content">�������</param>
		public static string Table(params object[] content) {
			return Tag("table", content);
		}

		/// <summary>��������� ��� TABLE</summary>
		/// <param name="content">�������</param>
		public static string Table(object content) {
			return Table(new object[] { content });
		}
		
		/// <summary>��������� ��� TR</summary>
		/// <param name="content">�������</param>
		public static string Tr(params object[] content) {
			return Tag("tr", content);
		}

		/// <summary>��������� ��� TR</summary>
		/// <param name="content">�������</param>
		public static string Tr(object content) {
			return Tr(new object[] { content });
		}
		
		/// <summary>��������� ��� TH</summary>
		/// <param name="content">�������</param>
		public static string Th(params object[] content) {
			return Tag("th", content);
		}

		/// <summary>��������� ��� TH</summary>
		/// <param name="content">�������</param>
		public static string Th(object content) {
			return Th(new object[] { content });
		}
		
		/// <summary>��������� ��� TD</summary>
		/// <param name="content">�������</param>
		public static string Td(params object[] content) {
			return Tag("td", content);
		}

		/// <summary>��������� ��� TD</summary>
		/// <param name="content">�������</param>
		public static string Td(object content) {
			return Td(new object[] { content });
		}
		
		/// <summary>��������� ��� H1</summary>
		/// <param name="content">�������</param>
		public static string H1(params object[] content) {
			return Tag("h1", content);
		}

		/// <summary>��������� ��� H1</summary>
		/// <param name="content">�������</param>
		public static string H1(object content) {
			return H1(new object[] { content });
		}
		
		/// <summary>��������� ��� H2</summary>
		/// <param name="content">�������</param>
		public static string H2(params object[] content) {
			return Tag("h2", content);
		}

		/// <summary>��������� ��� H2</summary>
		/// <param name="content">�������</param>
		public static string H2(object content) {
			return H2(new object[] { content });
		}
		
		/// <summary>��������� ��� H3</summary>
		/// <param name="content">�������</param>
		public static string H3(params object[] content) {
			return Tag("h3", content);
		}

		/// <summary>��������� ��� H3</summary>
		/// <param name="content">�������</param>
		public static string H3(object content) {
			return H3(new object[] { content });
		}
		
		/// <summary>��������� ��� H4</summary>
		/// <param name="content">�������</param>
		public static string H4(params object[] content) {
			return Tag("h4", content);
		}

		/// <summary>��������� ��� H4</summary>
		/// <param name="content">�������</param>
		public static string H4(object content) {
			return H4(new object[] { content });
		}
		
		/// <summary>��������� ��� H5</summary>
		/// <param name="content">�������</param>
		public static string H5(params object[] content) {
			return Tag("h5", content);
		}

		/// <summary>��������� ��� H5</summary>
		/// <param name="content">�������</param>
		public static string H5(object content) {
			return H5(new object[] { content });
		}
		
		/// <summary>��������� ��� H6</summary>
		/// <param name="content">�������</param>
		public static string H6(params object[] content) {
			return Tag("h6", content);
		}

		/// <summary>��������� ��� H6</summary>
		/// <param name="content">�������</param>
		public static string H6(object content) {
			return H6(new object[] { content });
		}

		/// <summary>��������� �������� �������� class</summary>
		/// <param name="val">�������� ��������</param>
		public static string A_class(object val) {
			return Attribute("class", val);
		}

		/// <summary>��������� �������� �������� width</summary>
		/// <param name="val">�������� ��������</param>
		public static string A_width(object val) {
			return Attribute("width", val);
		}

		/// <summary>��������� �������� �������� height</summary>
		/// <param name="val">�������� ��������</param>
		public static string A_height(object val) {
			return Attribute("height", val);
		}

		/// <summary>��������� �������� �������� border</summary>
		/// <param name="val">�������� ��������</param>
		public static string A_border(object val) {
			return Attribute("border", val);
		}

		/// <summary>��������� �������� �������� cellpadding</summary>
		/// <param name="val">�������� ��������</param>
		public static string A_cellpadding(object val) {
			return Attribute("cellpadding", val);
		}

		/// <summary>��������� �������� �������� cellspacing</summary>
		/// <param name="val">�������� ��������</param>
		public static string A_cellspacing(object val) {
			return Attribute("cellspacing", val);
		}

		/// <summary>��������� �������� �������� align</summary>
		/// <param name="val">�������� ��������</param>
		public static string A_align(object val) {
			return Attribute("align", val);
		}

		/// <summary>��������� �������� �������� valign</summary>
		/// <param name="val">�������� ��������</param>
		public static string A_valign(object val) {
			return Attribute("valign", val);
		}

		/// <summary>��������� �������� �������� style</summary>
		/// <param name="val">�������� ��������</param>
		public static string A_style(object val) {
			return Attribute("style", val);
		}

		/// <summary>��������� �������� �������� src</summary>
		/// <param name="val">�������� ��������</param>
		public static string A_src(object val) {
			return Attribute("src", val);
		}

		/// <summary>��������� �������� �������� href</summary>
		/// <param name="val">�������� ��������</param>
		public static string A_href(object val) {
			return Attribute("href", val);
		}

		/// <summary>��������� �������� �������� id</summary>
		/// <param name="val">�������� ��������</param>
		public static string A_id(object val) {
			return Attribute("id", val);
		}

		/// <summary>��������� �������� �������� name</summary>
		/// <param name="val">�������� ��������</param>
		public static string A_name(object val) {
			return Attribute("name", val);
		}

		/// <summary>��������� �������� �������� type</summary>
		/// <param name="val">�������� ��������</param>
		public static string A_type(object val) {
			return Attribute("type", val);
		}

		/// <summary>��������� �������� �������� title</summary>
		/// <param name="val">�������� ��������</param>
		public static string A_title(object val) {
			return Attribute("title", val);
		}
	}
	
	public abstract partial class Template {

		/// <summary>��������� ��� DIV</summary>
		/// <param name="content">�������</param>
		protected static string Div(object content) {
			return Html.Div(content);
		}

		/// <summary>��������� ��� DIV</summary>
		/// <param name="content">�������</param>
		protected static string Div(params object[] content) {
			return Html.Div(content);
		}

		/// <summary>��������� ��� P</summary>
		/// <param name="content">�������</param>
		protected static string P(object content) {
			return Html.P(content);
		}

		/// <summary>��������� ��� P</summary>
		/// <param name="content">�������</param>
		protected static string P(params object[] content) {
			return Html.P(content);
		}

		/// <summary>��������� ��� SPAN</summary>
		/// <param name="content">�������</param>
		protected static string Span(object content) {
			return Html.Span(content);
		}

		/// <summary>��������� ��� SPAN</summary>
		/// <param name="content">�������</param>
		protected static string Span(params object[] content) {
			return Html.Span(content);
		}

		/// <summary>��������� ��� PRE</summary>
		/// <param name="content">�������</param>
		protected static string Pre(object content) {
			return Html.Pre(content);
		}

		/// <summary>��������� ��� PRE</summary>
		/// <param name="content">�������</param>
		protected static string Pre(params object[] content) {
			return Html.Pre(content);
		}

		/// <summary>��������� ��� UL</summary>
		/// <param name="content">�������</param>
		protected static string Ul(object content) {
			return Html.Ul(content);
		}

		/// <summary>��������� ��� UL</summary>
		/// <param name="content">�������</param>
		protected static string Ul(params object[] content) {
			return Html.Ul(content);
		}

		/// <summary>��������� ��� OL</summary>
		/// <param name="content">�������</param>
		protected static string Ol(object content) {
			return Html.Ol(content);
		}

		/// <summary>��������� ��� OL</summary>
		/// <param name="content">�������</param>
		protected static string Ol(params object[] content) {
			return Html.Ol(content);
		}

		/// <summary>��������� ��� LI</summary>
		/// <param name="content">�������</param>
		protected static string Li(object content) {
			return Html.Li(content);
		}

		/// <summary>��������� ��� LI</summary>
		/// <param name="content">�������</param>
		protected static string Li(params object[] content) {
			return Html.Li(content);
		}

		/// <summary>��������� ��� INPUT</summary>
		/// <param name="content">�������</param>
		protected static string Input(object content) {
			return Html.Input(content);
		}

		/// <summary>��������� ��� INPUT</summary>
		/// <param name="content">�������</param>
		protected static string Input(params object[] content) {
			return Html.Input(content);
		}

		/// <summary>��������� ��� TEXTAREA</summary>
		/// <param name="content">�������</param>
		protected static string Textarea(object content) {
			return Html.Textarea(content);
		}

		/// <summary>��������� ��� TEXTAREA</summary>
		/// <param name="content">�������</param>
		protected static string Textarea(params object[] content) {
			return Html.Textarea(content);
		}

		/// <summary>��������� ��� TABLE</summary>
		/// <param name="content">�������</param>
		protected static string Table(object content) {
			return Html.Table(content);
		}

		/// <summary>��������� ��� TABLE</summary>
		/// <param name="content">�������</param>
		protected static string Table(params object[] content) {
			return Html.Table(content);
		}

		/// <summary>��������� ��� TR</summary>
		/// <param name="content">�������</param>
		protected static string Tr(object content) {
			return Html.Tr(content);
		}

		/// <summary>��������� ��� TR</summary>
		/// <param name="content">�������</param>
		protected static string Tr(params object[] content) {
			return Html.Tr(content);
		}

		/// <summary>��������� ��� TH</summary>
		/// <param name="content">�������</param>
		protected static string Th(object content) {
			return Html.Th(content);
		}

		/// <summary>��������� ��� TH</summary>
		/// <param name="content">�������</param>
		protected static string Th(params object[] content) {
			return Html.Th(content);
		}

		/// <summary>��������� ��� TD</summary>
		/// <param name="content">�������</param>
		protected static string Td(object content) {
			return Html.Td(content);
		}

		/// <summary>��������� ��� TD</summary>
		/// <param name="content">�������</param>
		protected static string Td(params object[] content) {
			return Html.Td(content);
		}

		/// <summary>��������� ��� H1</summary>
		/// <param name="content">�������</param>
		protected static string H1(object content) {
			return Html.H1(content);
		}

		/// <summary>��������� ��� H1</summary>
		/// <param name="content">�������</param>
		protected static string H1(params object[] content) {
			return Html.H1(content);
		}

		/// <summary>��������� ��� H2</summary>
		/// <param name="content">�������</param>
		protected static string H2(object content) {
			return Html.H2(content);
		}

		/// <summary>��������� ��� H2</summary>
		/// <param name="content">�������</param>
		protected static string H2(params object[] content) {
			return Html.H2(content);
		}

		/// <summary>��������� ��� H3</summary>
		/// <param name="content">�������</param>
		protected static string H3(object content) {
			return Html.H3(content);
		}

		/// <summary>��������� ��� H3</summary>
		/// <param name="content">�������</param>
		protected static string H3(params object[] content) {
			return Html.H3(content);
		}

		/// <summary>��������� ��� H4</summary>
		/// <param name="content">�������</param>
		protected static string H4(object content) {
			return Html.H4(content);
		}

		/// <summary>��������� ��� H4</summary>
		/// <param name="content">�������</param>
		protected static string H4(params object[] content) {
			return Html.H4(content);
		}

		/// <summary>��������� ��� H5</summary>
		/// <param name="content">�������</param>
		protected static string H5(object content) {
			return Html.H5(content);
		}

		/// <summary>��������� ��� H5</summary>
		/// <param name="content">�������</param>
		protected static string H5(params object[] content) {
			return Html.H5(content);
		}

		/// <summary>��������� ��� H6</summary>
		/// <param name="content">�������</param>
		protected static string H6(object content) {
			return Html.H6(content);
		}

		/// <summary>��������� ��� H6</summary>
		/// <param name="content">�������</param>
		protected static string H6(params object[] content) {
			return Html.H6(content);
		}

		/// <summary>��������� �������� ��������</summary>
		/// <param name="name">��� ��������</param>
		/// <param name="val">�������� ��������</param>
		public static string Attribute(string name, object val) {
			return Html.Attribute(name, val);
		}

		/// <summary>��������� �������� �������� class</summary>
		/// <param name="val">�������� ��������</param>
		protected static string A_class(object val) {
			return Html.A_class(val);
		}

		/// <summary>��������� �������� �������� width</summary>
		/// <param name="val">�������� ��������</param>
		protected static string A_width(object val) {
			return Html.A_width(val);
		}

		/// <summary>��������� �������� �������� height</summary>
		/// <param name="val">�������� ��������</param>
		protected static string A_height(object val) {
			return Html.A_height(val);
		}

		/// <summary>��������� �������� �������� border</summary>
		/// <param name="val">�������� ��������</param>
		protected static string A_border(object val) {
			return Html.A_border(val);
		}

		/// <summary>��������� �������� �������� cellpadding</summary>
		/// <param name="val">�������� ��������</param>
		protected static string A_cellpadding(object val) {
			return Html.A_cellpadding(val);
		}

		/// <summary>��������� �������� �������� cellspacing</summary>
		/// <param name="val">�������� ��������</param>
		protected static string A_cellspacing(object val) {
			return Html.A_cellspacing(val);
		}

		/// <summary>��������� �������� �������� align</summary>
		/// <param name="val">�������� ��������</param>
		protected static string A_align(object val) {
			return Html.A_align(val);
		}

		/// <summary>��������� �������� �������� valign</summary>
		/// <param name="val">�������� ��������</param>
		protected static string A_valign(object val) {
			return Html.A_valign(val);
		}

		/// <summary>��������� �������� �������� style</summary>
		/// <param name="val">�������� ��������</param>
		protected static string A_style(object val) {
			return Html.A_style(val);
		}

		/// <summary>��������� �������� �������� src</summary>
		/// <param name="val">�������� ��������</param>
		protected static string A_src(object val) {
			return Html.A_src(val);
		}

		/// <summary>��������� �������� �������� href</summary>
		/// <param name="val">�������� ��������</param>
		protected static string A_href(object val) {
			return Html.A_href(val);
		}

		/// <summary>��������� �������� �������� id</summary>
		/// <param name="val">�������� ��������</param>
		protected static string A_id(object val) {
			return Html.A_id(val);
		}

		/// <summary>��������� �������� �������� name</summary>
		/// <param name="val">�������� ��������</param>
		protected static string A_name(object val) {
			return Html.A_name(val);
		}

		/// <summary>��������� �������� �������� type</summary>
		/// <param name="val">�������� ��������</param>
		protected static string A_type(object val) {
			return Html.A_type(val);
		}

		/// <summary>��������� �������� �������� title</summary>
		/// <param name="val">�������� ��������</param>
		protected static string A_title(object val) {
			return Html.A_title(val);
		}
	}
}
