import { observable, action, computed } from 'mobx';

class Contacts {
    @observable all = [
        {id: 1, name: 'jack', email: '111@qq.com'},
        {id: 2, name: 'lili', email: '222@qq.com'},
        {id: 3, name: 'frank', email: '333@qq.com'},
    ];

    @computed get allItem() {
        return this.all.slice();
    }

    @computed get itemsCount() {
        return this.all.length;
    }

    @action addItem(item) {
        this.all.push(item);
    }
}

export default new Contacts();
