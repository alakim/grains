using System;
using System.Collections.Generic;
using System.Text;

#if NUNIT
using NUnit.Framework;
using NUnit.Framework.SyntaxHelpers;
#endif

namespace IVC.Markup {
	/// <summary>������ ��� ������������ ���������� HTML-����</summary>
	public abstract partial class Template {

		/// <summary>��������� �������� �������� HTML-����</summary>
		public abstract string Render();

		/// <summary>��������� ��������� ������ � ��������</summary>
		/// <param name="content">�������</param>
		/// <param name="template">������</param>
		public static string Apply(string[] content, Html.Template template) {
			return Html.Apply(content, template);
		}

		/// <summary>��������� �������� ������ ��������� ����� ���</summary>
		/// <param name="count">���������� ����������</param>
		/// <param name="template">������</param>
		public static string Times(int count, Html.Template template) {
			return Html.Times(count, template);
		}



#if NUNIT
		[TestFixture, Description("����� ��������")]
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

			[Test, Description("������� ����")]
			public void SimpleTest() {
				MyTemplate template = new MyTemplate(1);
				Assert.AreEqual("<div>count: 1</div>", template.Render());
			}

			[Test, Description("������� �������")]
			public void SimpleTableTest() {
				Template2 template = new Template2(new string[] {"������", "������"}, new string[] {"444-4444", "222-2222" });
				Assert.AreEqual("<table border=\"0\"><tr><td>������</td><td>444-4444</td></tr><tr><td>������</td><td>222-2222</td></tr></table>", template.Render());
			}
	
	
		}
	
#endif
	}
}
