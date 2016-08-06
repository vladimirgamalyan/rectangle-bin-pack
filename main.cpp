#include <nan.h>
#include "MaxRectsBinPack.h"

class Worker : public Nan::AsyncWorker {
public:
	Worker(std::vector<rbp::RectSize> rects, Nan::Callback *callback) : AsyncWorker(callback), rects(rects) {}

	void Execute() {
		if (rects.size()) {
			rbp::MaxRectsBinPack mrbp(2048, 2048);
			size_t origSize = rects.size();
			mrbp.Insert(rects, readyRects, rbp::MaxRectsBinPack::RectBestAreaFit);
			if (readyRects.size() != origSize) {
				//Nan::ThrowError("internal error");
				//return;
			}

			std::sort(readyRects.begin(), readyRects.end(), sortCompare);
		}
	}

	// We have the results, and we're back in the event loop.
	void HandleOKCallback() {
		Nan::HandleScope scope;

		uint32_t size = static_cast<uint32_t>(readyRects.size());
		v8::Local<v8::Array> result = Nan::New<v8::Array>(size);

		for (uint32_t i = 0; i < size; ++i) {
			const rbp::Rect& r = readyRects[i];
			v8::Local<v8::Object> obj = Nan::New<v8::Object>();
			Nan::Set(obj, Nan::New("x").ToLocalChecked(), Nan::New<v8::Uint32>(r.x));
			Nan::Set(obj, Nan::New("y").ToLocalChecked(), Nan::New<v8::Uint32>(r.y));
			Nan::Set(result, i, obj);
		}

		v8::Local<v8::Value> argv[] = {
			Nan::Null(),
			result
		};

		callback->Call(2, argv);
	}

private:
	static bool sortCompare(rbp::Rect a, rbp::Rect b) {
		return (a.tag < b.tag);
	}
	std::vector<rbp::RectSize> rects;
	std::vector<rbp::Rect> readyRects;
};

std::string parseArrayArg(const v8::Local<v8::Array>& arr, std::vector<rbp::RectSize>& rects) {
	Nan::HandleScope scope;
	
	uint32_t len = arr->Length();
	for (uint32_t i = 0; i < len; ++i) {
		v8::Local<v8::Value> item = Nan::Get(arr, i).ToLocalChecked();

		if (!item->IsObject()) {
			return "element of array must be an object";
		}
		v8::Local<v8::Object> obj = Nan::To<v8::Object>(item).ToLocalChecked();

		v8::Local<v8::Value> w = Nan::Get(obj, Nan::New<v8::String>("w").ToLocalChecked()).ToLocalChecked();
		v8::Local<v8::Value> h = Nan::Get(obj, Nan::New<v8::String>("h").ToLocalChecked()).ToLocalChecked();

		// 0..0xffffffff only
		if ((!w->IsUint32()) || (!h->IsUint32())) {
			return "dimension is not a number";
		}

		uint32_t width = Nan::To<uint32_t>(w).FromJust();
		uint32_t height = Nan::To<uint32_t>(h).FromJust();

		if ((!width) || (!height) || (width > 0xffff) || (height > 0xffff)) {
			return "invalid dimension";
		}

		rbp::RectSize r;
		r.width = static_cast<int>(width);
		r.height = static_cast<int>(height);
		r.tag = static_cast<int>(i);
		rects.push_back(r);
	}
	return std::string();
}

NAN_METHOD(solve) {

	if (info.Length() < 2) {
		Nan::ThrowError("not enough arguments");
		return;
	}

	if (!info[0]->IsArray()) {
		Nan::ThrowError("first argument is not an array");
		return;
	}

	if (!info[1]->IsFunction()) {
		Nan::ThrowError("second argument is not a function");
		return;
	}

	v8::Local<v8::Array> arr = info[0].As<v8::Array>();
	std::vector<rbp::RectSize> rects;
	std::string err = parseArrayArg(arr, rects);
	if (!err.empty())
	{
		Nan::ThrowError(err.c_str());
		return;
	}

	Nan::Callback* callback = new Nan::Callback(info[1].As<v8::Function>());

	//TODO: pass rects by move
	Nan::AsyncQueueWorker(new Worker(rects, callback));
}

NAN_METHOD(solveSync) {
	if (info.Length() < 1) {
		Nan::ThrowError("not enough arguments");
		return;
	}

	if (!info[0]->IsArray()) {
		Nan::ThrowError("first argument is not an array");
		return;
	}

	v8::Local<v8::Array> arr = info[0].As<v8::Array>();
	std::vector<rbp::RectSize> rects;
	std::string err = parseArrayArg(arr, rects);
	if (!err.empty())
	{
		Nan::ThrowError(err.c_str());
		return;
	}

	std::vector<rbp::Rect> readyRects;
	if (rects.size()) {
		rbp::MaxRectsBinPack mrbp(2048, 2048);
		size_t origSize = rects.size();
		mrbp.Insert(rects, readyRects, rbp::MaxRectsBinPack::RectBestAreaFit);
		if (readyRects.size() != origSize) {
			//Nan::ThrowError("internal error");
			//return;
		}
	}

	uint32_t size = static_cast<uint32_t>(readyRects.size());
	for (uint32_t i = 0; i < size; ++i) {
		const rbp::Rect& r = readyRects[i];
		v8::Local<v8::Object> obj = Nan::To<v8::Object>(Nan::Get(arr, i).ToLocalChecked()).ToLocalChecked();
		Nan::Set(obj, Nan::New("x").ToLocalChecked(), Nan::New<v8::Uint32>(r.x));
		Nan::Set(obj, Nan::New("y").ToLocalChecked(), Nan::New<v8::Uint32>(r.y));
	}

	info.GetReturnValue().Set(Nan::True());
}

NAN_MODULE_INIT(init) {
	Nan::Set(target, Nan::New<v8::String>("solve").ToLocalChecked(),
		Nan::GetFunction(Nan::New<v8::FunctionTemplate>(solve)).ToLocalChecked());
	Nan::Set(target, Nan::New<v8::String>("solveSync").ToLocalChecked(),
		Nan::GetFunction(Nan::New<v8::FunctionTemplate>(solveSync)).ToLocalChecked());
}

NODE_MODULE(rectangle_bin_pack, init)
