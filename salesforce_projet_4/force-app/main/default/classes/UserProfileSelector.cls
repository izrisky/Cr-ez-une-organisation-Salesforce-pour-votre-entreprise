public with sharing class UserProfileSelector {
    public static String getUserProfile() {
        return [SELECT Name FROM Profile WHERE Id = :UserInfo.getProfileId()].Name;
    }
}