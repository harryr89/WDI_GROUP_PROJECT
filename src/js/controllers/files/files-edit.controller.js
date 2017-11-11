angular
  .module('whatsOn')
  .controller('filesEditCtrl', filesEditCtrl);

filesEditCtrl.$inject = ['File', '$stateParams', '$state'];

function filesEditCtrl(File, $stateParams, $state) {
  const vm = this;
  vm.file = File.get($stateParams);
  vm.submit = file => {
    File
      .update({ id: file.id }, file)
      .$promise
      .then(() => {
        $state.go('fileShow', { id: file.id });
      });
  };
}