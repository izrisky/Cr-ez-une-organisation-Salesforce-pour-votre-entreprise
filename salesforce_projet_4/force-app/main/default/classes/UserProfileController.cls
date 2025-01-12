public with sharing class UserProfileController {
    @AuraEnabled(cacheable=true)
    public static String getUserProfile() {
        return UserProfileSelector.getUserProfile();
    }
}