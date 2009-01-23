using System;
using System.Collections.Generic;
using System.Text;

#if NUNIT
using NUnit.Framework;
using NUnit.Framework.SyntaxHelpers;
#endif

namespace IVC.Markup {
	/// <summary>Шаблон для формирования фрагментов HTML-кода</summary>
	public abstract partial class Template {

		/// <summary>Формирует выходной фрагмент HTML-кода</summary>
		public abstract string Render();

		/// <summary>Применяет указанный шаблон к контенту</summary>
		/// <param name="content">контент</param>
		/// <param name="template">шаблон</param>
		public static string Apply(string[] content, Html.Template template) {
			return Html.Apply(content, template);
		}

		/// <summary>Применяет заданный шаблон указанное число раз</summary>
		/// <param name="count">количество повторений</param>
		/// <param name="template">шаблон</param>
		public static string Times(int count, Html.Template template) {
			return Html.Times(count, template);
		}



#if NUNIT
		[TestFixture, Description("Тесты шаблонов")]
		public class TemplateTests {
			class MyTemplate : Template {
				public MyTemplate(int count) {
					this.count = count;
				}

				public int Count { get { return count; } set { count = value; }}
				private int count = 1;

				override public string Render() {
					return Div(
						"count: ",
						count
					);
				}
			}

			class Template2 : Template {
				public Template2(string[] names, string[] phones) {
					this.names = names;
					this.phones = phones;
				}
				private string[] names;
				private string[] phones;

				public override string Render() {
					return Table(A_border(0),
						Times(names.Length, delegate(object i){
							return Tr(
								Td(names[(int)i]),
								Td(phones[(int)i])
							);
						})
					);
				} 

			}

			[Test, Description("Простой тест")]
			public void SimpleTest() {
				MyTemplate template = new MyTemplate(1);
				Assert.AreEqual("<div>count: 1</div>", template.Render());
			}

			[Test, Description("Простая таблица")]
			public void SimpleTableTest() {
				Template2 template = new Template2(new string[] {"Иванов", "Петров"}, new string[] {"444-4444", "222-2222" });
				Assert.AreEqual("<table border=\"0\"><tr><td>Иванов</td><td>444-4444</td></tr><tr><td>Петров</td><td>222-2222</td></tr></table>", template.Render());
			}
	
	
		}
	
#endif
	}
}
