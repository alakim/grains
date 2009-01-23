using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.IO;

#if NUNIT
using NUnit.Framework;
using NUnit.Framework.SyntaxHelpers;
#endif

using H = IVC.Markup.Html;

namespace IVC.Markup {
	/// <summary>Утилита для формирования HTML-кода в функциональном стиле</summary>
	public static partial class Html {

		/// <summary>Тип для создания шаблонов верстки</summary>
		/// <param name="content">контент</param>
		public delegate string Template(object content);

		/// <summary>Применяет указанный шаблон к контенту</summary>
		/// <param name="content">контент</param>
		/// <param name="template">шаблон</param>
		public static string Apply(string[] content, Template template) {
			StringWriter html = new StringWriter();
			foreach(string str in content){
				html.Write(template(str));
			}
			return html.ToString();
		}

		/// <summary>Применяет заданный шаблон указанное число раз</summary>
		/// <param name="count">количество повторений</param>
		/// <param name="template">шаблон</param>
		public static string Times(int count, Template template) {
			StringWriter html = new StringWriter();
			for(int i = 0; i < count; i++) {
				html.Write(template(i));
			}
			return html.ToString();
		}


		/// <summary>Формирует описание атрибута</summary>
		/// <param name="name">имя атрибута</param>
		/// <param name="val">значение атрибута</param>
		public static string Attribute(string name, object val)
		{
			return string.Format(@"@{0}=""{1}""", name,  val.ToString().Replace("\"", "&quot;"));
		}


		private static Regex reAttribute = new Regex(@"^\@[a-z0-9_\-]+\=", RegexOptions.Compiled | RegexOptions.IgnoreCase);
		private static Regex reAttributePrefix = new Regex(@"^\@", RegexOptions.Compiled | RegexOptions.IgnoreCase);

		private static string Tag(string name, params object[] content) {
			StringWriter html = new StringWriter();
			StringWriter attributes = new StringWriter();

			foreach(object itm in content){
				string str = itm.ToString();
				if(reAttribute.IsMatch(str))
					attributes.Write(reAttributePrefix.Replace(str, " "));
				else
					html.Write(str);
			}

			return string.Format(@"<{0}{1}>{2}</{0}>", name, attributes, html);
		}

#if NUNIT
		[TestFixture, Description("Тесты формирования разметки")]
		public class MarkupTests {

			[Test, Description("Простой тест")]
			public void Test1() {
				string html = H.Div(
					H.P("abc")
				);

				Assert.AreEqual("<div><p>abc</p></div>", html);
			}

			[Test, Description("Простой тест")]
			public void Test2() {
				string html = H.Div(
					H.P("abc"),
					H.P("def ", 10)
				);

				Assert.AreEqual("<div><p>abc</p><p>def 10</p></div>", html);
			}

			[Test, Description("Таблица")]
			public void TableTest() {
				string html = H.Table(
					H.Tr(
						H.Td("11"),
						H.Td("12")
					),
					H.Tr(
						H.Td("21"),
						H.Td("22")
					)
				);

				Assert.AreEqual("<table><tr><td>11</td><td>12</td></tr><tr><td>21</td><td>22</td></tr></table>", html);
			}

			[Test, Description("Атрибуты")]
			public void AttributesTest_1() {
				string html = H.Div(
					H.Attribute("style", "color:red;"),
					"abc"
				);

				string standard = "<div style=\"color:red;\">abc</div>";

				Assert.AreEqual(standard, html);

				Assert.AreEqual(standard, H.Div(
					H.A_style("color:red;"),
					"abc"
				));
			}

			[Test, Description("Атрибуты")]
			public void AttributesTest_2() {
				string html = H.Div(
					H.Attribute("style", "color:red;"),
					H.Attribute("class", "big"),
					H.P("abc"),
					H.P(
						H.Attribute("class", "short"),
						"def"
					)
				);

				string standard = "<div style=\"color:red;\" class=\"big\"><p>abc</p><p class=\"short\">def</p></div>";

				Assert.AreEqual(standard, html);

				Assert.AreEqual(standard, H.Div(
					H.A_style("color:red;"),
					H.A_class("big"),
					H.P("abc"),
					H.P(
						H.A_class("short"),
						"def"
					)
				));
			}

			[Test, Description("Сложная верстка")]
			public void ComplexMarkupTest_1() {
				string[] lines = new string[] {
					"abc",
					"def",
					"ghi",
					"jkl"
				};
				string standard = "<div><p>abc</p><p>def</p><p>ghi</p><p>jkl</p></div>";

				// Первый способ. Самый тупой
				StringWriter pars = new StringWriter();
				foreach(string p in lines) {
					pars.Write(H.P(p));
				}
				string html = H.Div(pars.ToString());
				Assert.AreEqual(standard, html, "Error 1");

				// Второй способ. Используем готовые теги
				html = H.Div(H.Apply(lines, H.P));
				Assert.AreEqual(standard, html, "Error 2");

				// Третий способ. Уникальная верстка
				html = H.Div(
					H.Apply(lines, delegate(object content){
						return string.Format("x{0}x", content);
					})
				);
				Assert.AreEqual("<div>xabcxxdefxxghixxjklx</div>", html, "Error 3");

			}

			[Test, Description("Сложная верстка")]
			public void ComplexMarkupTest_2() {
				string[] lines = new string[] {
			        "abc",
			        "def"
			    };
				string html = H.Div(
					H.Apply(lines, delegate(object content) {
						return H.H2("Line") +
							H.P("content: ", content);
					})
				);

				Assert.AreEqual("<div><h2>Line</h2><p>content: abc</p><h2>Line</h2><p>content: def</p></div>", html);
			}
	
		}
	
#endif
	}
}
