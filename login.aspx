<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="login.aspx.cs" Inherits="Turnpike.login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <table border="1" cellpadding="3" cellspacing="0">
            <tr><td>Логин</td><td><asp:TextBox ID="tbLogin" runat="server" /></td></tr>
            <tr><td>Пароль</td><td><asp:TextBox ID="tbPassword" TextMode="Password" runat="server" /></td></tr>
        </table>
        <asp:Button runat="server" Text="Вход" ID="btLogin" OnClick="btLogin_Click" />
     </div>
    </form>
    <p>User State: <%=UserState %></p>
</body>
</html>
