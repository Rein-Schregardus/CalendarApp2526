namespace Server.Tests.Helpers
{
    /// <summary>
    /// Common test user accounts for consistency across tests.
    /// </summary>
    public static class TestUsers
    {
        public static readonly (string Email, string UserName, string Password) User1 =
            ("user1@example.com", "user1", "Password123!");

        public static readonly (string Email, string UserName, string Password) User2 =
            ("user2@example.com", "user2", "Password456!");
    }
}
