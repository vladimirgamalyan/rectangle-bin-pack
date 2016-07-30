#include <node.h>

using namespace v8;

void Method(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = args.GetIsolate();
	args.GetReturnValue().Set(String::NewFromUtf8(isolate, "ok"));
}

void init(Local<Object> exports) {
	NODE_SET_METHOD(exports, "solve", Method);
}

NODE_MODULE(rectangle_bin_pack, init)
