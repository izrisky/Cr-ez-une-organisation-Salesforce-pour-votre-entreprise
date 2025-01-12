import { LightningElement, api, wire, track } from 'lwc';
import getOpportunityProducts from '@salesforce/apex/OpportunityProductsController.getOpportunityProducts';
import getUserProfile from '@salesforce/apex/UserProfileController.getUserProfile';

export default class OpportunityProductsViewer extends LightningElement {
    @api recordId;
    @track products;
    @track wiredProducts;
    @track error;
    @track noProducts = false; // Nouvelle propriété pour gérer l'affichage d'un message
    @track columns = [];


    noProductsMessage = `Vous n'avez aucune ligne de produits pour le moment.\n1. Veuillez tout d'abord sélectionner un Catalogue (Pricebook).\n2. Sélectionnez ensuite les produits à ajouter.`;
    errorMessage =`Vous avez au moins un ligne avec un problème de quantité, veuillez supprimer cette ligne ou réduire sa quantité.\n Si vous absolument besoin de plus de produits, veuillez contacter votre administrateur système.`;
    userProfile;
    @wire(getUserProfile)
    wiredUserProfile({ data, error }) {
        if (data) {
            this.userProfile = data;
            this.setupColumns();
        } else if (error) {
            this.error = error;
        }
    }
    
    ///TODO
    /// Utiliser un icon button pour delete, et modifier le designe du button view product
    setupColumns() {
        this.columns  = [
            { label: 'Nom du produit', fieldName: 'Name', type: 'text' },
            { label: 'Quantité', fieldName: 'Quantity', type: 'Number' },
            { label: 'Prix unitaire', fieldName: 'UnitPrice', type: 'currency' },
            { label: 'Prix Total', fieldName: 'TotalPrice', type: 'currency' },
            { label: 'Quantité en stock', fieldName: 'QuantityInStock', type: 'Number' },
            {label: 'Supprimer', type: 'button',typeAttributes: {label: 'Supprimer', name: 'delete',variant: 'destructive'}}
        ];
        // Ajouter le bouton "Voir" uniquement pour le profil Admin
        if (this.userProfile === 'System Administrator') {
            this.columns.push({
                label: 'View Product',
                type: 'button',
                typeAttributes: {
                    label: 'Voir',
                    name: 'view',
                    variant: 'neutral'
                }
            });
        }
    }
 
    @wire(getOpportunityProducts, { oppId: '$recordId' }) 
    wiredProducts(result) {
        this.wiredProducts=result;
        if (result.data) {
            this.products = result.data.map(item => ({
                Id: item.Id,
                Name: item.Product2.Name, // Accès au nom du produit
                Quantity: item.Quantity,
                UnitPrice: item.UnitPrice,
                TotalPrice: item.TotalPrice,
                QuantityInStock:item.Product2.QuantityInStock__c, // Accès au nom du produit
            }));
            this.noProducts = this.products.length === 0; // Mettre à jour noProducts
            this.error = null;
        } else if (result.error) {
            this.products = [];
            this.error = error;
            console.error('Error loading products:', error);
        }
    }

    ///TODO
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
                break;
        }
    }

    deleteProduct(productId) {
        ///TODO
        console.info('Supprimer le produit avec l\'Id :', productId);
    }

    viewProduct(productId) {
        ///TODO
        console.info('Voir le produit avec l\'Id :', productId);
    }
}