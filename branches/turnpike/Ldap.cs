using System;
using System.Collections.Generic;
using System.Web;
using System.Text.RegularExpressions;
using System.Security.Principal;
using System.DirectoryServices;

namespace Turnpike {
	/// <summary>Утилита для взаимодействия с AD</summary>
	public class Ldap {
		/// <summary>Конструктор</summary>
		/// <param name="domain">имя домена</param>
		public Ldap(string domain) {
			this.domain = domain;
		}

		/// <summary>Имя домена</summary>
		private string domain;

		/// <summary>Возвращает текущий домен</summary>
		private static string GetCurrentDomainPath() {
			try {
				DirectoryEntry de = new DirectoryEntry("LDAP://RootDSE");
				string path = "LDAP://" + de.Properties["defaultNamingContext"][0].ToString();
				return path;
			}
			catch (Exception err) {
				throw new Exception("Error getting Directory Entry", err);
			}
		}

		/// <summary>Возвращает DN текущего пользователя</summary>
		public string GetUserDN() {
			string userName;
			try {
				WindowsIdentity wi = WindowsIdentity.GetCurrent();
				userName = wi.Name;
			}
			catch (Exception err) {
				throw new Exception("Error getting Windows Identity", err);
			}

			DirectoryEntry de = new DirectoryEntry(GetCurrentDomainPath());
			DirectorySearcher ds = new DirectorySearcher(de);
			Regex reDomain = new Regex(@"^"+domain+@"\\", RegexOptions.Compiled | RegexOptions.IgnoreCase);
			string uNm = reDomain.Replace(userName, string.Empty);
			string filter = "(&(objectCategory=User)(objectClass=person)(samaccountname=" + uNm + "))";
			ds.Filter = filter;
			try {
				SearchResult result = ds.FindOne();
				if (result == null) return string.Empty;
				return result.Properties["distinguishedname"][0].ToString();
			}
			catch (Exception err) {
				throw new Exception("Error finding directory entry", err);
			}
		}

		/// <summary>Авторизация пользователя</summary>
		/// <param name="login">логин</param>
		/// <param name="password">пароль</param>
		public bool AuthorizeUser(string login, string password) {
			DirectoryEntry entry = new DirectoryEntry(GetCurrentDomainPath(), "gs\\"+login, password);

			try {
				DirectorySearcher search = new DirectorySearcher(entry);
				search.Filter = "(SAMAccountName=" + login + ")";
				search.PropertiesToLoad.Add("cn");
				SearchResult result = search.FindOne();
				return result != null;
			}
			catch (Exception) {
				return false;
			}
		}


	}
}