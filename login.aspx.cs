using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Turnpike {
	public partial class login : System.Web.UI.Page {

		protected string UserState = "Authorization required!";

		protected void Page_Load(object sender, EventArgs e) {

		}

		protected void btLogin_Click(object sender, EventArgs e) {
			string login = tbLogin.Text;
			string password = tbPassword.Text;
			Ldap ldap = new Ldap("GS");
			bool authorized = ldap.AuthorizeUser(login, password);
			if (authorized) UserState = "Authorized User";
		}

		
	}
}