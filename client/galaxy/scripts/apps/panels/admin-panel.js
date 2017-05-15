var _l = require( 'utils/localization' );

var AdminPanel = Backbone.View.extend({
    initialize: function( page, options ) {
        var self = this;
        this.page       = page;
        this.root       = options.root;
        this.config     = options.config;
        this.settings   = options.settings;
        this.message    = options.message;
        this.status     = options.status;
        this.model = new Backbone.Model({
            title   : _l( 'Administration' )
        });
        this.categories = new Backbone.Collection([{
            title : 'Server',
            items : [ {
                title   : 'Data types registry',
                url     : 'admin/view_datatypes_registry'
            },{
                title   : 'Data tables registry',
                url     : 'admin/view_tool_data_tables'
            },{
                title   : 'Display applications',
                url     : 'admin/display_applications'
            },{
                title   : 'Manage jobs',
                url     : 'admin/jobs'
            } ]
        },{
            title : 'Tools and Tool Shed',
            items : [ {
                title   : 'Search Tool Shed',
                url     : 'admin_toolshed/browse_tool_sheds',
                enabled : self.settings.is_tool_shed_installed
            },{
                title   : 'Search Tool Shed (Beta)',
                url     : 'admin_toolshed/browse_toolsheds',
                enabled : self.settings.is_tool_shed_installed && self.config.enable_beta_ts_api_install
            },{
                title   : 'Monitor installing repositories',
                url     : 'admin_toolshed/monitor_repository_installation',
                enabled : self.settings.installing_repository_ids
            },{
                title   : 'Manage installed tools',
                url     : 'admin_toolshed/browse_repositories',
                enabled : self.settings.is_repo_installed
            },{
                title   : 'Reset metadata',
                url     : 'admin_toolshed/reset_metadata_on_selected_installed_repositories',
                enabled : self.settings.is_repo_installed
            },{
                title   : 'Download local tool',
                url     : 'admin/package_tool'
            },{
                title   : 'Tool lineage',
                url     : 'admin/tool_versions'
            },{
                title   : 'Reload a tool\'s configuration',
                url     : 'admin/reload_tool'
            },{
                title   : 'Review tool migration stages',
                url     : 'admin/review_tool_migration_stages'
            },{
                title   : 'View Tool Error Logs',
                url     : 'admin/tool_errors'
            },{
                title   : 'Manage Display Whitelist',
                url     : 'admin/sanitize_whitelist'
            },{
                title   : 'Manage Tool Dependencies',
                url     : 'admin/manage_tool_dependencies'
            } ]
        },{
            title : 'User Management',
            items : [ {
                title   : 'Users',
                url     : 'admin/users'
            },{
                title   : 'Groups',
                url     : 'admin/groups'
            },{
                title   : 'Roles',
                url     : 'admin/roles'
            },{
                title   : 'API keys',
                url     : 'userskeys/all_users'
            },{
                title   : 'Impersonate a user',
                url     : 'admin/impersonate',
                enabled : self.config.allow_user_impersonation
            } ]
        },{
            title : 'Data',
            items : [ {
                title   : 'Quotas',
                url     : 'admin/quotas',
                enabled : self.config.enable_quotas
            },{
                title   : 'Data libraries',
                url     : 'library_admin/browse_libraries'
            },{
                title   : 'Roles',
                url     : 'admin/roles'
            },{
                title   : 'Local data',
                url     : 'data_manager'
            } ]
        },{
            title : 'Form Definitions',
            items : [ {
                title   : 'Form definitions',
                url     : 'forms/browse_form_definitions'
            } ]
        },{
            title : 'Sample Tracking',
            items : [ {
                title   : 'Sequencers and external services',
                url     : 'external_service/browse_external_services'
            },{
                title   : 'Request types',
                url     : 'request_type/browse_request_types'
            },{
                title   : 'Sequencing requests',
                url     : 'requests_admin/browse_requests'
            },{
                title   : 'Find samples',
                url     : 'requests_common/find_samples?cntrller=requests_admin'
            } ]
        }]);
        this.setElement( this._template() );
    },

    render : function() {
        var self = this;
        this.$el.empty();
        this.categories.each( function( category ) {
            var $section = $( self._templateSection( category.attributes ) );
            var $entries = $section.find( '.ui-panel-section-body' );
            _.each( category.get( 'items' ), function( item ) {
                if ( item.enabled === undefined || item.enabled ) {
                    $entries.append( $( '<div/>' ).addClass( 'ui-panel-section-body-title' )
                                                  .append( $( '<a/>' ).attr({
                                                                href    : self.root + item.url,
                                                                target  : 'galaxy_main' }).text( item.title ) ) );
                }
            });
            self.$el.append( $section );
        });
        this.page.$( '#galaxy_main' ).prop( 'src', this.root + 'admin/center?message=' + this.message + '&status=' + this.status );
    },

    _templateSection : function( options ) {
        return [
            '<div>',
                '<div class="ui-panel-section-title">' + options.title + '</div>',
                '<div class="ui-panel-section-body"/>',
            '</div>'
        ].join('');
    },

    _template : function() {
        return '<div class="ui-panel"/>';
    },

    toString : function() { return 'adminPanel' }
});

module.exports = AdminPanel;