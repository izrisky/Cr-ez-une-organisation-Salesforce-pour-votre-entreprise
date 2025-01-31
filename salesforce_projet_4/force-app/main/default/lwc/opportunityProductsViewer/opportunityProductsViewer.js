// Import necessary modules and dependencies
import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'; // For navigation functionality
import { refreshApex } from '@salesforce/apex'; // To refresh data from Apex
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // For displaying toast messages

import CanSeeProductPermission from '@salesforce/customPermission/CanSeeProduct'; // Custom permission to control access

// Import Apex methods for data operations
import getOpportunityProducts from '@salesforce/apex/OpportunityProductsController.getOpportunityProducts';
import deleteProduct from '@salesforce/apex/OpportunityProductsController.deleteProduct';

// Import custom labels for internationalization
import productNameLabel from '@salesforce/label/c.Product_Name';
import deleteLabel from '@salesforce/label/c.Delete';
import lineQuantityErrorLabel from '@salesforce/label/c.Line_quantity_error';
import productLinesEmptyLabel from '@salesforce/label/c.product_lines_empty';
import opportunityProductsLabel from '@salesforce/label/c.Opportunity_products';
import quantityLabel from '@salesforce/label/c.quantity';
import quantityInstockLabel from '@salesforce/label/c.Quantity_in_stock';
import seeProductLabel from '@salesforce/label/c.See_product';
import totalPriceLabel from '@salesforce/label/c.Total_Price';
import unitPriceLabel from '@salesforce/label/c.Unit_Price';

import successLabel from '@salesforce/label/c.Success';
import errorLabel from '@salesforce/label/c.Error';
import errorDeletingProductLabel from '@salesforce/label/c.error_deleting_product';
import failedToNavigatePageLabel from '@salesforce/label/c.Failed_to_navigate_page';
import invalidOpportunityLine from '@salesforce/label/c.Invalid_opportunity_line';
import productSuccessfullyDeletedLabel from '@salesforce/label/c.product_successfully_deleted';




export default class OpportunityProductsViewer extends  NavigationMixin(LightningElement) {
    @api recordId; // Opportunity ID passed to the component
    @track products; // List of products associated with the opportunity
    @track wiredProducts; // Stores the result of the wired Apex method
    @track error; // Stores any errors that occur
    @track noProducts = false; // Tracks if there are no products to display
    @track errorProductLine = false; // Tracks if there is an error in product line quantities
    @track columns = this.initColumns(); // Initializes the columns for the data table
    hasError = false; // Par défaut, aucune erreur

    // Custom labels for error messages and UI
    quantityError=lineQuantityErrorLabel;
    opportunityProducts=opportunityProductsLabel;
    productLinesEmpty=productLinesEmptyLabel;


    // Method to initialize the columns for the data table
    initColumns() {
        const baseColumns  = [
            { label: productNameLabel, fieldName: 'Name', type: 'text' },
            {
                label: quantityLabel,
                fieldName: 'Quantity',
                type: 'Number',
                cellAttributes: {
                    class: { fieldName: 'stockClass' }  // Conditional CSS class for stock levels
                }
            },
            { label: unitPriceLabel, fieldName: 'UnitPrice', type: 'currency' },
            { label: totalPriceLabel, fieldName: 'TotalPrice', type: 'currency' },
            { label: quantityInstockLabel, fieldName: 'QuantityInStock', type: 'Number' },           
            {label: deleteLabel, type: 'button-icon',  // Delete button with an icon
            typeAttributes: {
                iconName: 'utility:delete',  // Trash icon
                name: 'delete',
                variant: 'destructive',
                title: deleteLabel}}
        ];
        // Add the "View Product" button if the user has the custom permission
        if (CanSeeProductPermission){
            baseColumns.push(
                {
                label: seeProductLabel,
                type: 'button', // Button with icon and text
                typeAttributes: {
                iconName: 'utility:preview', // Eye icon
                label: seeProductLabel,
                name: 'view',
                variant: 'brand',
                title: seeProductLabel
            }
            }
        );
        }
        return baseColumns;
    }
 
    // Wire method to fetch opportunity products from Apex
    @wire(getOpportunityProducts, { oppId: '$recordId' }) 
    wiredProducts(result) {
        this.wiredProducts=result;
        if (result.data) {
            // Map the data to the products array with additional fields
            this.products = result.data.map(item => {                
                const quantityDelta = item.Product2.QuantityInStock__c - item.Quantity;

                this.errorProductLine=this.errorProductLine||quantityDelta<0;
                return ({
                Id: item.Id,
                Name: item.Product2.Name, 
                Quantity: item.Quantity,
                UnitPrice: item.UnitPrice,
                TotalPrice: item.TotalPrice,
                QuantityInStock:item.Product2.QuantityInStock__c, 
                Product2Id: item.Product2Id,
                stockClass: quantityDelta <0 ?'slds-text-color_error' : 'slds-text-color_success' // Red or green based on stock
            });
        });
            this.error = null;
            this.noProducts = this.products.length === 0; // Update noProducts flag
        } 
        else if (result.error)    
        {
            this.products = [];
            this.error =  result.error;
            this.noProducts = this.products.length === 0; // Update noProducts flag
            console.error('Error loading products:',  result.error);
        }
        
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        switch (action.name) {
            case 'delete':
                this.deleteProduct(row.Id);
                break;
            case 'view':
                this.viewProduct(row.Id);
                break;
            default:
                console.error('Action non reconnue :', action.name);
                break;
        }
    }

    deleteProduct(lineItemId) {
        deleteProduct({ lineItemId })
            .then(() => {
                this.products = this.products.filter(product => product.Id !== lineItemId);
                this.noProducts = this.products.length === 0;
                this.refreshProducts();
                this.showToast(successLabel, productSuccessfullyDeletedLabel, 'success');
            })
            .catch(error => {
                this.showToast(errorLabel, errorDeletingProductLabel, 'error');
                console.error('Erreur lors de la suppression du produit :', error);
            });
    }

    // Method to navigate to the product details page
     viewProduct(opportunityLineItemId) {
        if (!opportunityLineItemId) {
            this.showToast(errorLabel, invalidOpportunityLine, 'error');
            return;
        }
        try {
            // Navigate to the record page using NavigationMixin
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: opportunityLineItemId,
                    objectApiName: 'OpportunityLineItem',
                    actionName: 'view'
                }
            });
        } catch (error) {
            this.showToast(errorLabel, failedToNavigatePageLabel, 'error');
        }
    }

    // Method to refresh the product list
    async refreshProducts() {    
        try {            
            await refreshApex(this.wiredProducts);
        }
        catch (e)
        {
            console.error('handleRafraichir loading opportunities:',e);
        }
    }
    
    // Method to display a toast message
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}